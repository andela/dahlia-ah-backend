import helpers from '../helpers';
import errorHandler from './errorHandler';


const { validators } = helpers;
const {
  isValidComment, isNotEmptySlug, isValidUUID
} = validators;

const { validatorError } = errorHandler;

const commentValidator = {
  getCommentValidator: [
    isNotEmptySlug(),
    validatorError
  ],
  postCommentValidator: [
    isValidComment(),
    isNotEmptySlug(),
    validatorError
  ],
  replyCommentValidator: [
    isNotEmptySlug(),
    isValidUUID('parentId'),
    isValidComment(),
    validatorError
  ],
  editCommentValidator: [
    isValidComment(),
    isValidUUID('commentId'),
    validatorError
  ],
  getEditedComment: [
    isValidUUID('commentId'),
    validatorError
  ]
};

export default commentValidator;
