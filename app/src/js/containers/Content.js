import { connect } from 'react-redux';
import withImmutablePropsToJS from 'with-immutable-props-to-js';
import { createUser } from '../actions/content';
import Content from '../components/Content';
import * as contentSelectors from '../selectors/content';

const mapStateToProps = state => ({
  initialValues: contentSelectors.getInitialValues(state),
  editorMode: contentSelectors.getEditorMode(state),
  statusText: contentSelectors.getStatusText(state),
  submitStatusText: contentSelectors.getSubmitStatusText(state),
  credentials: contentSelectors.getCredentials(state)
});

const mapDispatchToProps = dispatch => ({
  onSubmit: data => dispatch(createUser(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withImmutablePropsToJS(Content));
