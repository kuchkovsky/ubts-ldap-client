import { editorFormName } from "../containers/Form";

export const getEditorFormValues = state => state.getIn(['form', editorFormName, 'values']);
