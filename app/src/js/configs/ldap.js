import ldap from 'ldapjs';
import cyrillicToTranslit from 'cyrillic-to-translit-js';
import generatePassword from 'password-generator';

const client = ldap.createClient({
  url: process.env.LDAP_URL
});

const translit = cyrillicToTranslit({ preset: 'uk' });

client.bind(`CN="${process.env.LDAP_USER}",${process.env.BASE_DN}`, process.env.LDAP_PASSWORD, err => {
  if (err) {
    console.error('AUTH FAILURE', err);
  }
});

export const extractGroup = dn => {
  const withoutCn = dn.replace(/CN=[^,]+,/, '');
  return withoutCn.substring(withoutCn.indexOf('OU=') + 3, withoutCn.indexOf(','));
};

export const createCn = user => `${user.lastName} ${user.firstName} ${user.middleName ? user.middleName : ''}`
export const createDn = user =>
  `CN=${createCn(user)},OU=${user.group},${process.env.STUDENTS_DN},${process.env.BASE_DN}`;

export const fetchUsers = (lastName = undefined, firstName = undefined, patronymic = undefined) => {
  return new Promise((resolve, reject) => {
    if (!lastName || !(lastName || firstName || patronymic)) {
      return resolve([]);
    }
    const opts = {
      filter: `(&(objectClass=user)${firstName ? `(givenName=${firstName})` : ''}${lastName ? `(sn=${lastName})` : ''}${patronymic ? `(patronymic=${patronymic})` : ''})`,
      scope: 'sub',
      attributes: ['dn', 'givenName', 'sn', 'patronymic', 'mail', 'telephoneNumber', 'birthdate']
    };    
    client.search(`${process.env.STUDENTS_DN},${process.env.BASE_DN}`, opts, (err, res) => {
      if (err) return reject(err);
      const entries = [];
      res.on('searchEntry', entry => entries.push(entry.object));
      res.on('end', () => resolve(entries));
    });
  });
};

const createReplace = modification => new ldap.Change({ operation: 'replace', modification });
const createDelete = modification => new ldap.Change({ operation: 'delete', modification });

export const modifyLdapUser = user => {
  return new Promise(async (resolve, reject) => {
    const changes = [ createReplace({ mail: user.email }) ];
    if (user.phone) {
      changes.push(createReplace({ telephoneNumber: user.phone }));
    }
    if (user.birthdate) {
      changes.push(createReplace({ birthdate: user.birthdate }));
    }
    
    const generatedDn = createDn(user);
    try {
      const res = await fetchUsers(user.lastName, user.firstName, user.middleName);
      const fetchedUser = res[0];

      if (!user.phone && fetchedUser.telephoneNumber) {
        changes.push(createDelete({ telephoneNumber: [] }));
      }
      if (!user.birthdate && fetchedUser.birthdate) {
        changes.push(createDelete({ birthdate: [] }));
      }

      const modify = () => client.modify(generatedDn, changes, err => err ? reject(err) : resolve());
      if (fetchedUser.dn != generatedDn) {
        client.modifyDN(fetchedUser.dn, generatedDn, err => err ? reject(err) : modify());
      } else {
        modify();
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const createLdapUser = user => {
  return new Promise((resolve, reject) => {
    const userName = translit.transform(`${user.firstName} ${user.lastName}`, '_').toLowerCase();
    const userPassword = generatePassword();
    const entry = {
      cn: createCn(user),
      givenName: user.firstName,
      sn: user.lastName,
      mail: user.email,
      sAMAccountName: userName,
      userPrincipalName: user.email,
      userPassword,
      objectClass: ['organizationalPerson', 'person', 'top', 'user']
    };
    if (user.middleName) {
      entry.patronymic = user.middleName;
    }
    if (user.phone) {
      entry.telephoneNumber = user.phone;
    }
    if (user.birthdate) {
      entry.birthdate = user.birthdate;
    }
    client.add(createDn(user), entry, err => err ? reject(err) : resolve({ login: userName, password: userPassword }));
  });
};
