import jwt from 'jsonwebtoken';
import services from '../services';
import helpers from '../helpers';

const { errorResponse } = helpers;

const { findUser } = services;

const secret = process.env.SECRET_KEY;

/**
 *
 *
 * @param {object} req
 * @param {object} res
 * @param {*} next
 * @returns {*} json or next
 */
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return errorResponse(res, 401, 'No token provided');
  }
  jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      return errorResponse(res, 401, 'Failed to authenticate token');
    }
    const user = await findUser(decoded.id, res);
    req.user = user;
    return next();
  });
};

export default verifyToken;
