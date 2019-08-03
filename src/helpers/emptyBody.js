import responseMessage from './responseMessage';

/**
 * @description checks for empty body requests
 * @param {object} request express request object
 * @param {onject} response express response object
 * @param {object} next express next object
 * @returns {json} json
 */
export default (request, response, next) => {
  const { body } = request;
  if (!Object.keys(body).length) {
    responseMessage(response, 400, { error: 'empty request body' });
  } else {
    next();
  }
};
