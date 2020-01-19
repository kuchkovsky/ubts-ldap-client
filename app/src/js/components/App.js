import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Content from '../containers/Content';
import AppToolbar from './AppToolbar';

const App = () => (
  <React.Fragment>
    <CssBaseline/>
    <AppToolbar/>
    <Content/>
  </React.Fragment>
);

export default App;
