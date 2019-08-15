import helpers from '../helpers';
import errorHandler from './errorHandler';

const { validators, emptyBody } = helpers;
const {
  isValidEmail, isValidName, isValidUUID, isValidPassword,
  isValidProfileName, isValidProfilePassword,
  isValidAvatarUrl, isValidUUIDParam
} = validators;

const { validatorError, paramsValidatorError } = errorHandler;

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
  followUserValidator: [
    isValidUUIDParam('userId'),
    paramsValidatorError
  ],
  validateCreateUser: [
    isValidEmail(),
    isValidName('firstName'),
    isValidName('lastName'),
    isValidName('roleName'),
    validatorError
  ],
  validateUUID: [
    isValidUUIDParam('userId'),
    validatorError
  ]
};

export default userValidator;
