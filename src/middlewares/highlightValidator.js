import validator from '../helpers/validator';
import errorHandler from './errorHandler';

const {
  isValidInt
} = validator;

const { validatorError } = errorHandler;

const highlightValidator = {
  createHighlightValidator: [
    isValidInt('startIndex'),
    isValidInt('endIndex'),
    validatorError
  ]
};

export default highlightValidator;
