import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

const secret = process.env.SECRET_KEY;
const saltRounds = 7;

/**
   * Password hashing method
   * @param {String} password - unencrypted password
   * @returns {String} - encrypted password
   */
const hashedPassword = password => bcrypt.hashSync(password, saltRounds);

/**
   * Compare passwords
   * @param {String} password - unencrypted password
   * @param {String} hashPassword - encrypted password
   * @returns {Boolean} - passwords match?
   */
const comparePassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);

/**
   * Generate JWT
   * @param {Object} payload - object literal resource to be encoded
   * @returns {String} - jwt token
   */
const generateToken = (payload) => {
  const token = jwt.sign({ ...payload }, secret, { expiresIn: '7 days' });
  return token;
};

export default { hashedPassword, comparePassword, generateToken };
