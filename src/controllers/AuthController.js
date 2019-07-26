import jwt from 'jsonwebtoken';
import helpers from '../helpers';
import services from '../services';

const { forgotPasswordMessage } = helpers;
const { sendMail, findUser } = services;

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
    const user = await findUser(email, response);
    const { id, firstName } = user;
    if (!id) return;
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
