import helpers from '../helpers';
import errorHandler from './errorHandler';


const { validators } = helpers;
const {
  isValidComment, isNotEmptySlug, isValidId
} = validators;

const { validatorError } = errorHandler;

const commentValidator = {
  postComment: [
    isValidComment(),
    isNotEmptySlug(),
    validatorError
  ],
  replyComment: [
    isNotEmptySlug(),
    isValidId('parentId'),
    isValidComment(),
    validatorError
  ]
};

export default commentValidator;
