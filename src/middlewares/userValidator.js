import validator from '../helpers/validator';
import errorHandler from './errorHandler';

const userValidator = {
  signUp: [
    validator.isValidEmail(),
    validator.isValidName('firstName'),
    validator.isValidName('lastName'),
    validator.isValidUserName('userName'),
    validator.isValidPassword(),
    errorHandler.validatorError
  ],
};

export default userValidator;
