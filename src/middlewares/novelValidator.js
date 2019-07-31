import validator from '../helpers/validator';
import errorHandler from './errorHandler';

const {
  isNotEmpty, isValidGenre
} = validator;

const { validatorError } = errorHandler;

const novelValidator = {
  createNovel: [
    isNotEmpty('title'),
    isNotEmpty('description'),
    isNotEmpty('body'),
    isValidGenre('genre'),
    validatorError
  ]
};

export default novelValidator;
