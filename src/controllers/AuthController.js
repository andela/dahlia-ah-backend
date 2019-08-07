import jwt from 'jsonwebtoken';
import helpers from '../helpers';
import services from '../services';

const { forgotPasswordMessage, responseMessage } = helpers;
const { sendMail, userServices: { findUser } } = services;

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

export default {
  forgotPassword
};
