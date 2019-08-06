import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import helpers from '../helpers';
import services from '../services';

dotenv.config();

const { SECRET_KEY } = process.env;

const { responseMessage } = helpers;
const { userServices: { findUser } } = services;

/**
 *
 * @param {object} request
 * @param {object} response
 * @param {*} next
 * @returns {*} json or next
 */
export default (request, response, next) => {
  const token = request.headers.authorization || request.query.token;

  if (!token) {
    return responseMessage(response, 401, { error: 'no token provided' });
  }
  jwt.verify(token, SECRET_KEY, async (error, decoded) => {
    if (error) {
      const message = (error.name === 'TokenExpiredError') ? 'token expired' : 'invalid token';
      return responseMessage(response, 401, { error: message });
    }
    try {
      const user = await findUser(decoded.id);
      if (!user) {
        return responseMessage(response, 404, { error: 'user not found' });
      }
      request.user = user;
      return next();
    } catch (err) {
      return responseMessage(response, 500, { error: err.message });
    }
  });
};
