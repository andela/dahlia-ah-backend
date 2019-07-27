import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

const secret = process.env.SECRET_KEY;
const saltRounds = 7;

/**
 * Authentication Helper Class
 */
class AuthHelper {
  /**
   * Password hashing method
   * @param {String} password - unencrypted password
   * @returns {String} - encrypted password
   */
  static hashPassword(password) {
    return bcrypt.hashSync(password, saltRounds);
  }

  /**
   * Compare passwords
   * @param {String} password - unencrypted password
   * @param {String} hashPassword - encrypted password
   * @returns {Boolean} - passwords match?
   */
  static comparePassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  }

  /**
   * Generate JWT
   * @param {Object} payload - object literal resource to be encoded
   * @returns {String} - jwt token
   */
  static generateToken(payload) {
    const token = jwt.sign({ ...payload }, secret, { expiresIn: '48h' });
    return token;
  }
}

export default AuthHelper;
