import validator from '../helpers/validator';
import errorHandler from './errorHandler';

const {
  isNotEmpty, isValidGenre, isValidInt
} = validator;

const { validatorError } = errorHandler;

const novelValidator = {
  createNovel: [
    isNotEmpty('title'),
    isNotEmpty('description'),
    isNotEmpty('body'),
    isValidGenre('genre'),
    validatorError
  ],
  getNovels: [
    isValidInt('page').optional(),
    isValidInt('limit').optional(),
    validatorError
  ]
};

export default novelValidator;
