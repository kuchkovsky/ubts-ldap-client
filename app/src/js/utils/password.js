import generatePassword from 'password-generator';

const uppercaseMinCount = 3;
const lowercaseMinCount = 3;
const numberMinCount = 2;
const specialMinCount = 2;
const UPPERCASE_RE = /([A-Z])/g;
const LOWERCASE_RE = /([a-z])/g;
const NUMBER_RE = /([\d])/g;
const SPECIAL_CHAR_RE = /([\?\-])/g;
const NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;
 
const isStrongEnough = (password, minLength) => {
  const uc = password.match(UPPERCASE_RE);
  const lc = password.match(LOWERCASE_RE);
  const n = password.match(NUMBER_RE);
  const sc = password.match(SPECIAL_CHAR_RE);
  const nr = password.match(NON_REPEATING_CHAR_RE);
  return password.length >= minLength &&
    !nr &&
    uc && uc.length >= uppercaseMinCount &&
    lc && lc.length >= lowercaseMinCount &&
    n && n.length >= numberMinCount &&
    sc && sc.length >= specialMinCount;
}
 
export const strongPassword = (minLength = 10, maxLength = 12) => {
  let password = '';
  const randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
  while (!isStrongEnough(password, minLength)) {
    password = generatePassword(randomLength, false, /[\w\d\?\-]/);
  }
  return password;
}
