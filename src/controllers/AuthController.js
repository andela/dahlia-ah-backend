import jwt from 'jsonwebtoken';
import helpers from '../helpers';
import services from '../services';
import models from '../database/models';

const {
  forgotPasswordMessage, responseMessage, errorResponse, successResponse,
} = helpers;
const { sendMail, userServices: { findUser } } = services;
const { User } = models;

/**
 *
 *
 * @param {object} request
 * @param {object} response
 * @returns {json} - json
 */

const forgotPassword = async (request, response) => {
  const { email } = request.body;
  try {
    const user = await findUser(email);
    if (!user) return responseMessage(response, 404, { error: 'user not found' });
    const { id, firstName } = user;
    const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '2h' });
    const message = forgotPasswordMessage(firstName, token);
    await sendMail(process.env.ADMIN_MAIL, email, message);
    return response.status(200).json({
      message: 'you will receive a link in your mail shortly'
    });
  } catch (error) {
    response.status(500).json({
      error: error.message
    });
  }
};

/**
 * Update user verified status
 *
 * @param {object} req
 * @param {object} res
 * @returns {json} - json
 */

const updateStatus = async (req, res) => {
  const { params: { token }, user: { verifiedToken, isVerified, id } } = req;

  if (verifiedToken !== token) {
    return errorResponse(res, 403, 'Sorry could not verify email');
  }

  if (isVerified) {
    return errorResponse(res, 400, 'user already verified');
  }

  await User.update({
    isVerified: true,
  }, {
    where: {
      id,
    }
  });
  return successResponse(res, 200, { message: 'You have sucessfully verified your email' });
};

export default { forgotPassword, updateStatus };
