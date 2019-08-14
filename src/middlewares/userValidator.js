import helpers from '../helpers';
import errorHandler from './errorHandler';

const { validators } = helpers;
const {
  isValidEmail, isValidName, isValidId, isValidPassword
} = validators;

const { validatorError } = errorHandler;

const userValidator = {
  signUpValidator: [
    isValidEmail(),
    isValidName('firstName'),
    isValidName('lastName'),
    isValidPassword(),
    validatorError
  ],
  loginValidator: [
    isValidEmail(),
    validatorError
  ],
  profileValidator: [
    isValidId('userId'),
    validatorError
  ],
  forgotPassword: [
    isValidEmail(),
    validatorError
  ],
};

export default userValidator;
