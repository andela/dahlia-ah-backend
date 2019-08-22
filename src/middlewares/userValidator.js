import helpers from '../helpers';
import errorHandler from './errorHandler';

const { validators, emptyBody } = helpers;
const {
  isValidEmail, isValidName, isValidUUID, isValidPassword,
  isValidProfileName, isValidProfilePassword,
  isValidAvatarUrl
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
    isValidUUID('userId'),
    validatorError
  ],
  editProfileValidator: [
    isValidProfileName('firstName'),
    isValidProfileName('lastName'),
    isValidAvatarUrl(),
    isValidProfilePassword(),
    validatorError,
    emptyBody
  ],
  forgotPassword: [
    isValidEmail(),
    validatorError
  ],
  changePassword: [
    isValidPassword('currentPassword'),
    isValidPassword('newPassword'),
    validatorError
  ],
};

export default userValidator;
