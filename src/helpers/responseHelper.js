/**
   * helper for sending server success messages
   * @param {Object} res - server response
   * @param {Object} statusCode - server status code
   * @param {Object} data - application resource
   * @returns {Object} custom response
   */
const successResponse = (res, statusCode, data) => res.status(statusCode).json(data);

/**
   * helper for sending server success messages
   * @param {Object} res - server response
   * @param {Object} statusCode - error status code
   * @param {Object} errors - operation error message
   * @returns {Object} custom response
   */
const errorResponse = (res, statusCode, errors) => res.status(statusCode).json({ errors });

export { successResponse, errorResponse };
