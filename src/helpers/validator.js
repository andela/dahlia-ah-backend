import { check, param } from 'express-validator';

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
   * @param {String} field
   * @returns {Object} - Express-validator
   */
const isValidPassword = (field = 'password') => check(field).isLength({ min: 8 })
  .withMessage(`${field} must be at least 8 characters long`).not()
  .isEmpty()
  .withMessage(`${field} is a required field`)
  .isAlphanumeric()
  .withMessage(`${field} should contain only numbers and alphabets`);

/**
 * @returns {Object} - Express-validator
 */
const isValidPasswords = () => check('newPassword').isLength({ min: 8 })
  .withMessage('password must be at least 8 characters long').not()
  .isEmpty()
  .withMessage('password is a required field')
  .isAlphanumeric()
  .withMessage('password should contain only numbers and alphabets');

/**
   * @param {String} field
   * @returns {Object} - Express-validator
   */
const isValidProfileName = field => check(field)
  .optional()
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
const isValidProfilePassword = () => check('password').isLength({ min: 8 })
  .optional()
  .withMessage('password cannot be updated here')
  .isLength({ min: 0, max: 0 })
  .withMessage('password cannot be updated here');

/**
   * @param {String} field
   * @returns {Object} - Express-validator
   */
const isValidUrl = field => check(field)
  .optional()
  .trim()
  .not()
  .isEmpty()
  .withMessage(`${field} cannot be blank`)
  .isURL()
  .withMessage(`${field} must be a valid URL string`);

/**
   * @param {String} field
   * @returns {Object} - Express-validator
   */
const isNotEmpty = field => check(field)
  .trim()
  .exists()
  .withMessage(`${field} is a required field`)
  .not()
  .isEmpty()
  .withMessage(`${field} cannot be empty`);

/**
   * @param {String} field
   * @returns {Object} - Express-validator
   */
const isOptional = field => check(field)
  .optional()
  .trim()
  .not()
  .isEmpty()
  .withMessage(`${field} cannot be empty`);

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
   * @returns {Object} - Express-validator
   */
const isValidPublishedStatus = () => check('isPublished')
  .optional()
  .not()
  .isEmpty({ ignore_whitespace: true })
  .withMessage('isPublished cannot be empty')
  .isIn(['true', 'false'])
  .withMessage('isPublish can only be true or false');

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
const isValidUUID = field => check(field)
  .exists()
  .withMessage(`${field} is a required field`)
  .trim()
  .not()
  .isEmpty()
  .withMessage(`${field} cannot be empty`)
  .isUUID()
  .withMessage(`${field} must be an UUID`);

/**
   * @param {String} field
   * @returns {Object} - Express-validator
   */
const isValidInt = field => check(field)
  .exists()
  .withMessage(`${field} is a required field`)
  .trim()
  .not()
  .isEmpty()
  .withMessage(`${field} cannot be empty`)
  .isInt()
  .withMessage(`${field} must be an integer`);
const isNotTypeOfReport = () => check('type')
  .trim()
  .isIn(['badWords', 'general'])
  .withMessage('type must be badWords or general');

const isBoolean = field => check(field)
  .isBoolean()
  .optional()
  .withMessage(`${field} must be a boolean ( true or false )`);

const isBooleanNotOptional = field => check(field)
  .exists()
  .withMessage(`${field} is a required field`)
  .isBoolean()
  .withMessage(`${field} must be a boolean ( true or false )`);
/**
   * @param {String} paramName
   * @returns {Object} - Express-validator
   */
const isValidUUIDParam = paramName => param(paramName)
  .trim()
  .isUUID()
  .withMessage('invalid request');

const isValidUUIDOptional = field => check(field)
  .trim()
  .optional()
  .isUUID()
  .withMessage(`${field} must be an UUID`);
/**
   * @param {String} field
   * @returns {Object} - Express-validator
   */
const isValidPhoneNumber = field => check(field)
  .trim()
  .isMobilePhone()
  .withMessage(`${field} requires a valid phone number`);

/**
   * @param {String} field
   * @returns {Object} - Express-validator
   */
const isValidSubcription = field => check(field)
  .trim()
  .isIn(['true', 'false'])
  .withMessage(`${field} requires a valid phone number`);

/**
 * Validates allowed role names
   * @param {String} field
   * @returns {Object} - Express-validator
   */
const isValidRoleName = field => check(field)
  .trim()
  .isIn(['reader', 'author', 'admin', 'superadmin'])
  .withMessage(`${field} can only be one of: 'reader', 'author', 'admin', 'superadmin'`);

/**
   * @param {String} field
   * @returns {Object} - Express-validator
   */
const isValidReadInput = field => check(field)
  .exists()
  .withMessage(`${field} is a required field`)
  .trim()
  .withMessage(`${field} cannot be empty`)
  .isIn(['true', 'false'])
  .withMessage(`${field} can only contain true or false`);

export default {
  isValidEmail,
  isValidName,
  isValidPassword,
  isNotEmpty,
  isOptional,
  isValidGenre,
  isNotEmptySlug,
  isValidComment,
  isValidUUID,
  isValidProfileName,
  isValidProfilePassword,
  isValidUrl,
  isValidInt,
  isNotTypeOfReport,
  isBoolean,
  isValidUUIDParam,
  isValidPhoneNumber,
  isValidSubcription,
  isValidRoleName,
  isValidPasswords,
  isValidReadInput,
  isBooleanNotOptional,
  isValidPublishedStatus,
  isValidUUIDOptional,
};
