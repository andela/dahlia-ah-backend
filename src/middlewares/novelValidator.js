import validator from '../helpers/validator';
import errorHandler from './errorHandler';

const {
  isNotEmpty, isValidInt, isValidPublishedStatus,
  isValidUrl, isValidName, isNotEmptySlug,
  isOptional, isValidReadInput
} = validator;

const { validatorError } = errorHandler;

const novelValidator = {
  createNovelValidator: [
    isNotEmpty('title'),
    isNotEmpty('description'),
    isNotEmpty('body'),
    isValidName('genre'),
    isValidUrl('coverImgUrl'),
    isValidUrl('thumbImgUrl'),
    isValidPublishedStatus(),
    validatorError
  ],
  getNovelValidator: [
    isValidInt('page').optional(),
    isValidInt('limit').optional(),
    isNotEmpty('title').optional(),
    isNotEmpty('genre').optional(),
    isNotEmpty('author').optional(),
    isNotEmpty('keyword').optional(),
    isValidPublishedStatus(),
    validatorError
  ],
  getRandomNovelValidator: [
    isValidInt('limit').optional(),
    validatorError
  ],
  createGenreValidator: [
    isValidName('name'),
    isNotEmpty('description'),
    isNotEmpty('themeColor'),
    isValidUrl('coverImgUrl'),
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
    isValidPublishedStatus(),
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
