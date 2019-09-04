import validator from '../helpers/validator';
import errorHandler from './errorHandler';

const {
  isNotEmpty, isValidGenre, isValidInt, isValidName, isNotEmptySlug, isOptional, isValidReadInput
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
  getRandomNovelValidator: [
    isValidInt('limit').optional(),
    validatorError
  ],
  createGenreValidator: [
    isValidName('name'),
    validatorError
  ],
  getNovelBySlugValidator: [
    isNotEmptySlug(),
    validatorError
  ],
  editNovelValidator: [
    isOptional('title'),
    isOptional('description'),
    isOptional('body'),
    isOptional('genre'),
    validatorError
  ],
  getGenreValidator: [
    isNotEmpty('keyword').optional(),
    validatorError
  ],
  markReadValidator: [
    isValidReadInput('readStatus'),
    validatorError
  ]
};

export default novelValidator;
