import validator from '../helpers/validator';
import errorHandler from './errorHandler';

const {
  isNotEmpty, isNotEmptySlug, isNotTypeOfReport, isBoolean, isValidUUID
} = validator;

const { validatorError } = errorHandler;

const reportValidator = {
  createReport: [
    isNotEmpty('type'),
    isNotTypeOfReport(),
    isNotEmpty('body'),
    isNotEmptySlug(),
    validatorError
  ],
  getReport: [
    isBoolean('isHandled'),
    validatorError
  ],
  markAsHandled: [
    isValidUUID('id'),
    validatorError
  ]
};

export default reportValidator;
