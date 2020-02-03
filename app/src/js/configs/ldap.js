import ldap from 'ldapjs';
import fs from 'fs';
import cyrillicToTranslit from 'cyrillic-to-translit-js';
import { strongPassword } from '../utils/password';
import axios from 'axios';

const client = ldap.createClient({
  url: process.env.LDAP_URL,
  tlsOptions: {
    ca: [ fs.readFileSync('ca.crt') ]
  },
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

const createCn = user => `${user.lastName} ${user.firstName}${user.middleName ? ` ${user.middleName}` : ''}`

const createDn = user =>
  `CN=${createCn(user)},OU=${user.group},${process.env.STUDENTS_DN},${process.env.BASE_DN}`;

const encodeUTF16LE = password => new Buffer('"' + password + '"', 'utf16le').toString();

const syncUsers = () => axios.get(process.env.MOODLE_SYNC_ENDPOINT).catch(e => console.error(e));

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

export const fetchGroup = name => {
  return new Promise((resolve, reject) => {
    const opts = {
      filter: `(&(objectClass=group)(cn=${name}))`,
      scope: 'sub',
      attributes: ['dn', 'member']
    };
    client.search(`${process.env.STUDENTS_GROUPS_DN},${process.env.BASE_DN}`, opts, (err, res) => {
      if (err) return reject(err);
      const entries = [];
      res.on('searchEntry', entry => entries.push(entry.object));
      res.on('end', () => { if (entries.length) resolve(entries[0]); else reject('no results') });
    });
  });
};

const createReplace = modification => new ldap.Change({ operation: 'replace', modification });
const createDelete = modification => new ldap.Change({ operation: 'delete', modification });

export const modifyLdapUser = user => {
  return new Promise(async (resolve, reject) => {
    const changes = [createReplace({ mail: user.email })];
    if (user.phone) {
      changes.push(createReplace({ telephoneNumber: user.phone }));
    }
    if (user.birthdate) {
      changes.push(createReplace({ birthdate: user.birthdate }));
    }

    const generatedDn = createDn(user);
    try {
      const userResponse = await fetchUsers(user.lastName, user.firstName, user.middleName);
      const fetchedUser = userResponse[0];

      if (!user.phone && fetchedUser.telephoneNumber) {
        changes.push(createDelete({ telephoneNumber: [] }));
      }
      if (!user.birthdate && fetchedUser.birthdate) {
        changes.push(createDelete({ birthdate: [] }));
      }

      const fetchedGroup = await fetchGroup(extractGroup(fetchedUser.dn));
      const isGroupChanged = !fetchedGroup.member.some(memberDn => memberDn === generatedDn);

      if (isGroupChanged) {
        const oldGroupChange = createReplace({ member: fetchedGroup.member.filter(memberDn => memberDn !== fetchedUser.dn) });
        client.modify(fetchedGroup.dn, oldGroupChange, err => { if (err) reject(err); });
      }

      const modify = () => client.modify(generatedDn, changes, async err => {
        if (err) return reject(err);
        if (isGroupChanged) {
          const fetchedNewGroup = await fetchGroup(user.group);
          const newMembers = fetchedNewGroup.member.slice(0);
          newMembers.push(generatedDn);
          const newGroupChange = createReplace({ member: newMembers });
          client.modify(fetchedNewGroup.dn, newGroupChange, err => { if (err) reject(err); else resolve(); });
          syncUsers();
        } else {
          resolve();
        }
      });
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
    const userName = translit.transform(`${user.firstName} ${user.lastName}`, '_')
      .toLowerCase()
      .substring(0, 20);
    const userPassword = strongPassword();
    const entry = {
      cn: createCn(user),
      givenName: user.firstName,
      sn: user.lastName,
      mail: user.email,
      sAMAccountName: userName,
      userPrincipalName: `${userName}@ubts.org.ua`,
      unicodePwd: encodeUTF16LE(userPassword),
      userAccountControl: 66048, // MS-magic
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

    const generatedDn = createDn(user);

    client.add(generatedDn, entry, async err => {
      if (err) return reject(err);
      const fetchedNewGroup = await fetchGroup(user.group);
      const members = fetchedNewGroup.member;
      const newMembers = members ? (Array.isArray(members) ? members.slice(0) : [ members ]) : [];
      newMembers.push(generatedDn);
      const newGroupChange = createReplace({ member: newMembers });
      client.modify(fetchedNewGroup.dn, newGroupChange, err => {
        if (err) return reject(err);
        resolve({ login: userName, password: userPassword });
      });
      syncUsers();
    });
  });
};
