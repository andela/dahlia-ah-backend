import validator from '../helpers/validator';
import errorHandler from './errorHandler';

const {
  isNotEmpty, isValidGenre, isValidInt, isValidName
} = validator;

const { validatorError } = errorHandler;

const novelValidator = {
  createNovelValidator: [
    isNotEmpty('title'),
    isNotEmpty('description'),
    isNotEmpty('body'),
    isValidGenre('genre'),
    validatorError
  ],
  getNovelValidator: [
    isValidInt('page').optional(),
    isValidInt('limit').optional(),
    validatorError
  ],
  genreValidator: [
    isValidName('name'),
    validatorError
  ]
};

export default novelValidator;
