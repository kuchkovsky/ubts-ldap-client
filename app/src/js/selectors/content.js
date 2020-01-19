export const getInitialValues = state => state.getIn(['content', 'user']);

export const getEditorMode = state => state.getIn(['content', 'editorMode']);

export const getStatusText = state => state.getIn(['content', 'statusText']);

export const getSubmitStatusText = state => state.getIn(['content', 'submitStatusText']);

export const getCredentials = state => state.getIn(['content', 'credentials']);
