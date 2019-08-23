import { validationResult } from 'express-validator';

/**
   *This middleware handles validator errors and send a response to the user on error
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @return {Object} - Express response object
   */
const validatorError = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsArray = errors.array();
    const errorMessage = [];

    errorsArray.forEach((error) => {
      errorMessage.push({
        field: error.param,
        message: error.msg
      });
    });

    return res.status(400).send({
      errors: errorMessage
    });
  }
  next();
};

const paramsValidatorError = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorsArray = errors.array({ onlyFirstError: true });
    const errorMessage = errorsArray[0].msg;

    return res.status(400).send({
      error: errorMessage
    });
  }
  next();
};

export default { validatorError, paramsValidatorError };
