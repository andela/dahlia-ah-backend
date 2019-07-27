/**
   * helper for sending server success messages
   * @param {Object} res - server response
   * @param {Object} statusCode - server status code
   * @param {Object} data - response errors
   * @returns {Object} custom response
   */
const successResponse = (res, statusCode, data) => res.status(statusCode).json(data);

/**
   * helper for sending server success messages
   * @param {Object} res - server response
   * @param {Object} statusCode - server status code
   * @param {Object} errors - response nerrors
   * @returns {Object} custom response
   */
const errorResponse = (res, statusCode, errors) => res.status(statusCode).json({ errors });

export { successResponse, errorResponse };
