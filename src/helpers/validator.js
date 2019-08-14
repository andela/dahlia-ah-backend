import { check } from 'express-validator';

/**
   *  @param {String} field
   *  @returns {Object} - Express-validator
   */
const isValidEmail = (field = 'email') => check(field)
  .trim()
  .normalizeEmail()
  .isEmail()
  .withMessage('the email address you supplied is invalid')
  .not()
  .isEmpty()
  .withMessage('email is a required field');

/**
   * @param {String} field
   * @returns {Object} - Express-validator
   */
const isValidName = field => check(field)
  .trim()
  .custom((value) => {
    if (!/^[a-z]{1,}[\s]{0,1}[-']{0,1}[a-z]+$/i.test(value)) {
      return false;
    }
    return true;
  })
  .escape()
  .withMessage(`the ${field} can only contain alphabets, a space, apostrophe(') and a dash(-)`)
  .not()
  .isEmpty()
  .withMessage(`${field} is a required field`);

/**
   * @returns {Object} - Express-validator
   */
const isValidPassword = () => check('password').isLength({ min: 8 })
  .withMessage('password must be at least 8 characters long').not()
  .isEmpty()
  .withMessage('password is a required field')
  .isAlphanumeric()
  .withMessage('password should contain only numbers and alphabets');

/**
   * @param {String} field
   * @returns {Object} - Express-validator
   */
const isNotEmpty = field => check(field)
  .trim()
  .not()
  .isEmpty()
  .exists()
  .withMessage(`${field} is a required field`);

/**
   * @returns {Object} - Express-validator
   */
const isNotEmptySlug = () => check('slug')
  .not()
  .isEmpty({ ignore_whitespace: true })
  .withMessage('slug cannot be empty')
  .custom(value => !/\s/.test(value))
  .withMessage('slug cannot contain whitespace');


/**
   * @returns {Object} - Express-validator
   */
const isValidComment = () => check('commentBody')
  .exists()
  .withMessage('commentBody is a required field')
  .not()
  .isEmpty({ ignore_whitespace: true })
  .withMessage('commentBody cannot be empty')
  .isLength({ max: 200 });

/**
   * @param {String} field
   * @returns {Object} - Express-validator
   */
const isValidGenre = field => check(field)
  .trim()
  .not()
  .isEmpty()
  .exists()
  .withMessage(`${field} is a required field`)
  .isIn(['action', 'thriller', 'romance', 'fiction', 'motivational'])
  .withMessage('Must be a valid genre: action, thriller, romance, fiction, motivational');

/**
   * @param {String} field
   * @returns {Object} - Express-validator
   */
const isValidId = field => check(field)
  .exists()
  .withMessage(`${field} is a required field`)
  .trim()
  .not()
  .isEmpty()
  .withMessage(`${field} cannot be empty`)
  .isUUID()
  .withMessage(`${field} must be an UUID`);

export default {
  isValidEmail,
  isValidName,
  isValidPassword,
  isNotEmpty,
  isValidGenre,
  isNotEmptySlug,
  isValidComment,
  isValidId
};
