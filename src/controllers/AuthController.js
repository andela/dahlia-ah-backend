import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import helpers from '../helpers';
import services from '../services';
import models from '../database/models';
import verifyUser from '../helpers/verifyUser';

const {
  forgotPasswordMessage, responseMessage, errorResponse, successResponse, authHelper
} = helpers;
const {
  sendMail,
  userServices: { findUser, updateUser },
  passwordServices: { getPreviousPasswords, deletePreviousPassword, createPreviousPassword }
} = services;
const { User, BlacklistedToken } = models;

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

/**
 *
 * @name logOut
 * @param {object} req
 * @param {object} res
 * @returns {json} - json
 */
const logOut = (req, res) => {
  try {
    const { token, decoded: { exp } } = req;
    BlacklistedToken.create({ token, expTime: exp });
    return res.status(200).json({
      message: 'Logout was successful'
    });
  } catch (error) {
    return responseMessage(res, 500, { error: 'Something went wrong' });
  }
};

const resetPassword = async (request, response) => {
  const { user: { id, password }, body: { newPassword } } = request;
  const previousPasswords = await getPreviousPasswords(id);

  try {
    const { length } = previousPasswords;
    let passCount;
    let passwordExist;

    if (length) {
      passwordExist = previousPasswords
        .find(item => bcrypt.compareSync(newPassword, item.password));
      const { passwordCount } = previousPasswords[length - 1];
      passCount = passwordCount + 1;
    } else {
      passwordExist = bcrypt.compareSync(newPassword, password);
      passCount = 1;
    }

    if (passwordExist) {
      return responseMessage(response, 403, {
        error: 'new password is too similar to previous password'
      });
    }

    let prevPasswordId;
    if (length === 5) {
      prevPasswordId = previousPasswords[0].id;
      await deletePreviousPassword(prevPasswordId);
    }
    const hashedPassword = authHelper.hashedPassword(newPassword);
    await createPreviousPassword(id, hashedPassword, passCount);
    await updateUser({ password: hashedPassword }, id);

    return responseMessage(response, 200, {
      token: jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '5d' }),
      message: 'password succesfully changed'
    });
  } catch (error) {
    return responseMessage(response, 500, {
      error: error.message
    });
  }
};

const resendMail = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await findUser(id);
    if (!user) {
      return responseMessage(res, 404, {
        error: 'User not found',
      });
    }

    const { email, firstName, isVerified } = user;
    if (isVerified) {
      return responseMessage(res, 403, {
        error: 'you\'re already verified',
      });
    }

    await verifyUser({ id, email, firstName });
    return responseMessage(res, 200, {
      message: 'request sent you\'ll a mail shortly',
    });
  } catch (err) {
    return responseMessage(res, 500, {
      error: err.message,
    });
  }
};

export default {
  forgotPassword,
  updateStatus,
  logOut,
  changePassword,
  resetPassword,
  resendMail
};
