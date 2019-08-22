import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import helpers from '../helpers';
import services from '../services';
import models from '../database/models';

const {
  forgotPasswordMessage, responseMessage, errorResponse, successResponse,
} = helpers;
const {
  sendMail,
  userServices: { findUser, updateUser },
  passwordServices: { getPreviousPasswords, deletePreviousPassword, createPreviousPassword }
} = services;
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
 * Change password
 *
 * @param {object} request
 * @param {object} response
 * @returns {json} - json
 */

const changePassword = async (request, response) => {
  const { currentPassword, newPassword } = request.body;
  const { id, password } = request.user;
  try {
    const match = await bcrypt.compare(currentPassword, password);
    if (!match) {
      return responseMessage(response, 403, { error: 'wrong password' });
    }
    if (newPassword === currentPassword) {
      return responseMessage(response, 409, { error: 'new password cannot be the same the current password' });
    }
    const previousPasswords = await getPreviousPasswords(id);
    let count = 1;
    if (previousPasswords.length > 1) {
      const isPreviousPassword = previousPasswords
        .find(item => bcrypt.compareSync(newPassword, item.password));

      if (isPreviousPassword) {
        return responseMessage(response, 409, { error: 'you cannot use any of your last 5 passwords' });
      }
      count = previousPasswords[previousPasswords.length - 1].passwordCount + 1;
      if (previousPasswords.length === 5) {
        await deletePreviousPassword(previousPasswords[0].id);
      }
    }
    await createPreviousPassword(id, password, count);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUser({ password: hashedPassword }, id);
    return responseMessage(response, 200, { message: 'successfully changed password' });
  } catch (error) {
    responseMessage(response, 500, { error: error.message });
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

export default { forgotPassword, updateStatus, changePassword };
