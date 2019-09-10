import validator from '../helpers/validator';
import errorHandler from './errorHandler';

const {
  isValidUUIDOptional
} = validator;

const { validatorError } = errorHandler;

const notificationValidator = {
  markAsRead: [
    isValidUUIDOptional('id'),
    validatorError
  ]
};

export default notificationValidator;
