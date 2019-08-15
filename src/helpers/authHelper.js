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

/**
   * Generate a random password
   * @returns {String} randomPassword
   * @returns {String} hashedRandomPassword
   */
const generateRandomPassword = () => {
  const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerLetters = upperLetters.toLowerCase();
  const digits = '0123456789';
  const alphanumeric = upperLetters + lowerLetters + digits;
  const alphanumericArray = alphanumeric.split('');
  const arrayLength = alphanumericArray.length;
  let randomPassword = '';
  const passwordLength = 8;
  let i;

  for (i = 0; i <= passwordLength; i += 1) {
    const randomNumber = Math.floor(Math.random() * arrayLength);
    const char = alphanumericArray[randomNumber];
    randomPassword += char;
  }

  return { randomPassword, hashedRandomPassword: hashedPassword(randomPassword) };
};

export default {
  hashedPassword, comparePassword, generateToken, generateRandomPassword
};
