import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';
import Button from '@material-ui/core/Button';
import ReduxTextField from './shared/ReduxTextField';

const Form = ({ classes, pristine, invalid, onSubmit }) => (
  <form onSubmit={e => { e.preventDefault(); onSubmit(); }} className={classes.form}>
    <Field name="firstName" label="Ім'я*"
      component={ReduxTextField}
      fullWidth variant="outlined" margin="normal"/>
    <Field name="lastName" label="Прізвище*"
      component={ReduxTextField}
      fullWidth variant="outlined" margin="normal"/>
    <Field name="middleName" label="По батькові"
      component={ReduxTextField}
      fullWidth variant="outlined" margin="normal"/>
    <Field name="group" label="Група"
      component={ReduxTextField}
      fullWidth variant="outlined" margin="normal"/>
    <Field name="email" label="E-mail*"
      component={ReduxTextField} type="email"
      fullWidth variant="outlined" margin="normal"/>
    <Field name="phone" label="Номер телефону у форматі XXXXXXXXXXXX"
      component={ReduxTextField}
      fullWidth variant="outlined" margin="normal"/>
    <Field name="birthdate" label="Дата народження у форматі YYYY-MM-DD"
      component={ReduxTextField}
      fullWidth variant="outlined" margin="normal"/>
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      disabled={pristine || invalid}
      className={classes.submit}
    >
      Зберегти зміни
    </Button>
  </form>
);

Form.propTypes = {
  classes: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default Form;
