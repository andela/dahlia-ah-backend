import validator from '../helpers/validator';
import errorHandler from './errorHandler';

const {
  isNotEmpty, isValidGenre, isValidInt, isValidName, isNotEmptySlug
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
    isNotEmpty('title').optional(),
    isNotEmpty('genre').optional(),
    isNotEmpty('author').optional(),
    isNotEmpty('keyword').optional(),
    validatorError
  ],
  genreValidator: [
    isValidName('name'),
    validatorError
  ],
  getNovelBySlugValidator: [
    isNotEmptySlug(),
    validatorError
  ]
};

export default novelValidator;
