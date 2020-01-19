import { reduxForm } from 'redux-form/immutable';
import { validateForm } from '../utils/reduxForm';
import Form from '../components/Form';
import {
  changeLdapUserEditorMode,
  EDITOR_MODES,
  SUBMIT_STATUSES,
  changeLdapUserEditorStatusText,
  changeLdapUserEditorSubmitStatusText,
  changeLdapUserData,
  EDITOR_STATUSES
} from '../actions/content';
import { fetchUsers, extractGroup } from '../configs/ldap';

const fields = [
  {
    name: 'firstName',
    required: 'Обов\'язкове поле',
  },
  {
    name: 'lastName',
    required: 'Обов\'язкове поле',
  },
  {
    name: 'middleName',
  },
  {
    name: 'group',
    required: 'Обов\'язкове поле',
  },
  {
    name: 'email',
    regex: ['^\\S+@\\S+\\.\\S+$', 'Некоректний email'],
  },
  {
    name: 'phone',
    regex: ['^((380\\d{9})([,;]\\s*380\\d{9})?)?$', 'Введіть номер у форматі 380XXXXXXXXX. Два номери можна розділити символами \',\' або \';\'', true]
  },
  {
    name: 'birthdate',
    regex: ['^(\\d{4}-\\d{2}-\\d{2})?$', 'Введіть дату у форматі YYYY-MM-DD', true]
  }
];

let prevMiddleName = null;
let prevUserName = null;

const asyncValidate = (values, dispatch) => {


  const makeUserData = (firstName, lastName, middleName, group, email = null, phone = null, birthdate) => ({
    firstName,
    lastName,
    middleName,
    group,
    email,
    phone,
    birthdate,
  });

  const resetForm = values => {
    const userData = makeUserData(values.get('firstName'), values.get('lastName'), values.get('middleName'));
    dispatch(changeLdapUserData(userData));
  };

  return fetchUsers(values.get('lastName'), values.get('firstName'), values.get('middleName'))
    .then(res => {
      dispatch(changeLdapUserEditorSubmitStatusText(SUBMIT_STATUSES.INITIAL));
      if (res.length === 0) {
        resetForm(values);
        dispatch(changeLdapUserEditorStatusText(EDITOR_STATUSES.CREATE));
        dispatch(changeLdapUserEditorMode(EDITOR_MODES.CREATE));
      } else if (res.length === 1) {
        const user = res[0];
        const userName = user.dn.replace('CN=', '').replace(/,OU=.+/, '');
        if (userName === prevUserName) {
          return;
        }
        const userData = makeUserData(
          user.givenName,
          user.sn,
          prevMiddleName && prevMiddleName.length === 1 ? values.get('middleName') : user.patronymic,
          extractGroup(user.dn),
          user.mail,
          user.telephoneNumber,
          user.birthdate
        );
        dispatch(changeLdapUserData(userData));
        dispatch(changeLdapUserEditorStatusText(EDITOR_STATUSES.EDIT(userName)));
        dispatch(changeLdapUserEditorMode(EDITOR_MODES.EDIT));
        prevUserName = userName;
      } else {
        resetForm(values);
        dispatch(changeLdapUserEditorStatusText(EDITOR_STATUSES.CONFLICT));
        dispatch(changeLdapUserEditorMode(EDITOR_MODES.CONFLICT));
      }
      prevMiddleName = values.get('middleName');
    })
    .catch(e => {
      dispatch(changeLdapUserEditorStatusText(EDITOR_STATUSES.CONNECTION_ERROR));
      console.error(e);
      dispatch(changeLdapUserEditorMode(EDITOR_MODES.CONNECTION_ERROR))
    });

}

export default reduxForm({
  form: 'LdapUserEditorForm',
  validate: validateForm(fields),
  asyncValidate,
  enableReinitialize: true,
})(Form);
