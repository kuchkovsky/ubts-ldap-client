import { createAction } from 'redux-actions';
import { getEditorMode } from '../selectors/content';
import { modifyLdapUser, createLdapUser } from '../configs/ldap';

export const EDITOR_MODES = {
  INITIAL: 'INITIAL',
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  CONFLICT: 'CONFLICT',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
};

export const EDITOR_STATUSES = {
  INITIAL: 'Для початку роботи введіть дані користувача',
  CREATE: 'Створення нового користувача',
  EDIT: userName => `Редагування користувача ${userName}`,
  CONFLICT: 'Знайдено кількох користувачів з таким іменем. Будь ласка, введіть більше даних',
  CONNECTION_ERROR: 'Помилка з\'єднання з сервером',
}

export const SUBMIT_STATUSES = {
  INITIAL: '',
  SUCCESS: 'Зміни успішно збережено',
  FAILURE: 'Не вдалося зберегти зміни'
};

export const CHANGE_LDAP_USER_EDITOR_MODE = 'CHANGE_LDAP_USER_EDITOR_MODE';
export const changeLdapUserEditorMode = createAction(CHANGE_LDAP_USER_EDITOR_MODE);

export const CHANGE_LDAP_USER_EDITOR_STATUS_TEXT = 'CHANGE_LDAP_USER_EDITOR_STATUS_TEXT';
export const changeLdapUserEditorStatusText = createAction(CHANGE_LDAP_USER_EDITOR_STATUS_TEXT);

export const CHANGE_LDAP_USER_EDITOR_SUBMIT_STATUS_TEXT = 'CHANGE_LDAP_USER_EDITOR_SUBMIT_STATUS_TEXT';
export const changeLdapUserEditorSubmitStatusText = createAction(CHANGE_LDAP_USER_EDITOR_SUBMIT_STATUS_TEXT);

export const CHANGE_LDAP_USER_DATA = 'CHANGE_LDAP_USER_DATA';
export const changeLdapUserData = createAction(CHANGE_LDAP_USER_DATA);

export const RESET_LDAP_USER_DATA = 'RESET_LDAP_USER_DATA';
export const resetLdapUserData = createAction(RESET_LDAP_USER_DATA);

export const SET_CREDENTIALS = 'SET_CREDENTIALS';
export const setCredentials = createAction(SET_CREDENTIALS);

const generateSubmitErrorMessage = e => `${SUBMIT_STATUSES.FAILURE}: ${e.stack.substring(0, 50)}`;

export const createUser = data =>
  (dispatch, getState) => {
    const editorMode = getEditorMode(getState());
    const userData = data.toJS();
    if (editorMode === EDITOR_MODES.EDIT) {
      modifyLdapUser(userData)
        .then(() => dispatch(changeLdapUserEditorSubmitStatusText(SUBMIT_STATUSES.SUCCESS)))
        .catch(e => {
          console.error(e);
          dispatch(changeLdapUserEditorSubmitStatusText(generateSubmitErrorMessage(e)))
        });
    } else if (editorMode == EDITOR_MODES.CREATE) {
      createLdapUser(userData)
        .then(credentials => {
          dispatch(changeLdapUserEditorSubmitStatusText(SUBMIT_STATUSES.SUCCESS));
          dispatch(changeLdapUserEditorMode(EDITOR_MODES.INITIAL));
          dispatch(resetLdapUserData());
          dispatch(setCredentials(credentials));
        })
        .catch(e => {
          console.error(e);
          dispatch(changeLdapUserEditorSubmitStatusText(generateSubmitErrorMessage(e)))
        });
    }
  };
