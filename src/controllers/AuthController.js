import jwt from 'jsonwebtoken';
import helpers from '../helpers';
import services from '../services';
import findUser from '../services/findUser';

const { forgotPasswordMessage } = helpers;
const { sendMail } = services;

/**
 * Auth controller class
 * @class
 */
export default class AuthController {
  /**
 *
 *
 * @static
 * @param {object} request
 * @param {object} response
 * @returns {json} - json
 * @memberof AuthController
 */
  static async forgotPassword(request, response) {
    const { email } = request.body;
    try {
      const user = await findUser(email, response);
      const { id, firstName } = user;
      const token = jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: '2h' });
      const message = forgotPasswordMessage(firstName, token);
      await sendMail(process.env.ADMIN_MAIL, email, message);
      return response.status(200).json({
        status: 'success',
        message: 'you will receive a link in your mail shortly'
      });
    } catch (error) {
      response.status(500).json({
        status: 'failure',
        message: 'internal server error. we\'re working on it'
      });
    }
  }
}
