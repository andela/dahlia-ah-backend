import { Op } from 'sequelize';
import models from '../database/models';
import helpers from '../helpers';

const { authHelper, successResponse, errorResponse } = helpers;

const { User } = models;

/**
   * user signup controller
   * @param {Object} req - server request
   * @param {Object} res - server response
   * @returns {Object} - custom response
   */
const signUp = async (req, res) => {
  const {
    firstName, lastName, username, email, password
  } = req.body;

  const rows = await User.findAll({
    where: {
      [Op.or]: [{ email }, { username }]
    }
  });

  const foundUser = rows[0];


  if (foundUser && foundUser.email.toString() === email) {
    return errorResponse(res, 409, 'user with email already exists');
  }

  if (foundUser && foundUser.username.toString() === username) {
    const errors = 'username already taken';
    return errorResponse(res, 409, errors);
  }

  const user = {
    firstName,
    lastName,
    username,
    email,
    password: authHelper.hashedPassword(password)
  };

  const createdUser = await User.create(user);

  const response = {
    user: {
      email: createdUser.email,
      token: authHelper.generateToken({ id: createdUser.id }),
      username: createdUser.username,
      bio: createdUser.bio,
      image: createdUser.avatar
    }
  };

  return successResponse(res, 200, response);
};

/**
   * user login controller
   * @param {Object} req - server request
   * @param {Object} res - server response
   * @return {Object} - custom response
   */
const login = async (req, res) => {
  const {
    email, password
  } = req.body;

  const authErrorMessage = 'email or password is incorrect';

  const foundUser = await User.findOne({ where: { email } });

  if (!foundUser) return errorResponse(res, 401, authErrorMessage);

  const correctPassword = authHelper.comparePassword(password, foundUser.password);

  if (!correctPassword) return errorResponse(res, 401, authErrorMessage);

  if (!foundUser.isVerified) {
    return errorResponse(res, 401, 'please verify your email');
  }

  const data = {
    user: {
      email: foundUser.email,
      token: authHelper.generateToken({ id: foundUser.id }),
      username: foundUser.username,
      bio: foundUser.bio
    }
  };
  return successResponse(res, 200, data);
};


export { signUp, login };
