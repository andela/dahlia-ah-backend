import validator from '../helpers/validator';
import errorHandler from './errorHandler';

const {
  isValidEmail, isValidName, isValidUserName, isValidPassword
} = validator;

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
