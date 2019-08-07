/**
 * @description returns response message
 * @param {object} response express response object
 * @param {number} statusCode response status code
 * @param {object} payload object to be returned
 * @returns {json} json
 */
const responseMessage = async (response, statusCode, payload) => response.status(statusCode).json({
  ...payload
});

export default responseMessage;
