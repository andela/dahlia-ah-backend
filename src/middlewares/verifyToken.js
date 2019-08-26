import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import helpers from '../helpers';
import services from '../services';

dotenv.config();

const { SECRET_KEY, ACCOUNT_VERIFICATION_SECRET } = process.env;
const verifyPath = '/auth/verify/:token';
const { responseMessage } = helpers;
const { userServices: { findUser }, blacklistedTokenService: { findBlacklistedToken } } = services;

/**
 *
 * @param {object} request
 * @param {object} response
 * @param {*} next
 * @returns {*} json or next
 */
export default (request, response, next) => {
  const token = request.headers.authorization || request.query.token || request.params.token;
  const { route: { path } } = request;
  if (!token) {
    return responseMessage(response, 401, { error: 'you have to be signed in to continue' });
  }
  const secret = (path === verifyPath) ? ACCOUNT_VERIFICATION_SECRET : SECRET_KEY;

  jwt.verify(token, secret, async (error, decoded) => {
    if (error) {
      const message = (error.name === 'TokenExpiredError') ? 'token expired' : 'invalid token';
      responseMessage(response, 401, { error: message });
    }
    try {
      const blacklistedToken = await findBlacklistedToken(token);
      if (blacklistedToken) {
        return responseMessage(response, 401, { error: 'invalid token' });
      }
      const user = await findUser(decoded.id);
      if (!user) {
        return responseMessage(response, 404, { error: 'user not found' });
      }
      request.user = user;
      request.token = token;
      request.decoded = decoded;
      return next();
    } catch (err) {
      responseMessage(response, 500, { error: err.message });
    }
  });
};
