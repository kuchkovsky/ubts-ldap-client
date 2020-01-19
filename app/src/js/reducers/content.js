import { fromJS } from 'immutable';
import {
  EDITOR_MODES,
  CHANGE_LDAP_USER_EDITOR_MODE,
  CHANGE_LDAP_USER_EDITOR_STATUS_TEXT,
  CHANGE_LDAP_USER_EDITOR_SUBMIT_STATUS_TEXT,
  CHANGE_LDAP_USER_DATA,
  RESET_LDAP_USER_DATA,
  SUBMIT_STATUSES,
  EDITOR_STATUSES,
  SET_CREDENTIALS,
} from '../actions/content';

const initialState = fromJS({
  editorMode: EDITOR_MODES.INITIAL,
  statusText: EDITOR_STATUSES.INITIAL,
  submitStatusText: SUBMIT_STATUSES.INITIAL,
  user: {
    firstName: null,
    middleName: null,
    lastName: null,
    group: null,
    email: null,
    phone: null,
    birthdate: null,
  },
  credentials: {
    login: null,
    password: null,
  }
});

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
  case CHANGE_LDAP_USER_EDITOR_MODE:
    return state.set('editorMode', action.payload);

  case CHANGE_LDAP_USER_EDITOR_STATUS_TEXT:
    return state.set('statusText', action.payload);

  case CHANGE_LDAP_USER_EDITOR_SUBMIT_STATUS_TEXT:
    return state.set('submitStatusText', action.payload);

  case CHANGE_LDAP_USER_DATA:
    return state.set('user', fromJS(action.payload));

  case RESET_LDAP_USER_DATA:
    return state.set('user', initialState.get('user'));

  case SET_CREDENTIALS:
    return state.set('credentials', fromJS(action.payload));

  default:
    return state;
  }
};

export default contentReducer;
