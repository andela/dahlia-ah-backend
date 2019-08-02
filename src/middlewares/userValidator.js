import helpers from '../helpers';
import errorHandler from './errorHandler';


const { validators } = helpers;
const {
  isValidEmail, isValidName, isValidUserName, isValidPassword
} = validators;

const { validatorError } = errorHandler;

const userValidator = {
  signUp: [
    isValidEmail(),
    isValidName('firstName'),
    isValidName('lastName'),
    isValidUserName('username'),
    isValidPassword(),
    validatorError
  ],
  login: [
    isValidEmail(),
    validatorError
  ],
  forgotPassword: [
    isValidEmail(),
    validatorError
  ],
};

export default userValidator;
