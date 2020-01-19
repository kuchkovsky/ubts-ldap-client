const pathToArray = path => path.split('.');

const assignError = (errorObject, fieldName, text) => {
  const errors = Object.assign({}, errorObject);
  if (fieldName.includes('.')) {
    const [parent, child] = pathToArray(fieldName);
    if (errors[parent]) {
      errors[parent][child] = text;
    } else {
      errors[parent] = { [child]: text };
    }
  } else {
    errors[fieldName] = text;
  }
  return errors;
};

export const validateForm = fields =>
  values => {
    let errors = {};
    const getFromPath = path => values.getIn(pathToArray(path));
    fields.forEach(field => {
      if (field.when && !field.when(getFromPath)) {
        return;
      }
      const value = values.getIn(pathToArray(field.name));
      if (field.required && (!value && value !== 0)) {
        errors = assignError(errors, field.name, field.required);
        return;
      }
      if (field.minLength) {
        const [length, text] = field.minLength;
        if (value.length < length) {
          errors[field.name] = text;
        }
        return;
      }
      if (field.regex) {
        const [regex, text, allowEmpty] = field.regex;
        if (!(allowEmpty && !value) &&!new RegExp(regex).test(value)) {
          errors[field.name] = text;
        }
      }
    });
    return errors;
  };

export default validateForm;
