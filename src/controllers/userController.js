import models from '../database/models';
import helpers from '../helpers';
import services from '../services';

const {
  authHelper, successResponse, errorResponse, responseMessage
} = helpers;
const { userServices: { findUser, findFollower } } = services;
const { User } = models;

/**
   * user signup controller
   * @param {Object} req - server request
   * @param {Object} res - server response
   * @returns {Object} - custom response
   */
const signUp = async (req, res) => {
  const {
    firstName, lastName, email, password
  } = req.body;

  const foundUser = await findUser(email);

  if (foundUser && foundUser.email.toString() === email) {
    return errorResponse(res, 409, 'user with email already exists');
  }

  const user = {
    firstName,
    lastName,
    email,
    password: authHelper.hashedPassword(password)
  };

  const createdUser = await User.create(user);
  const response = {
    user: {
      id: createdUser.id,
      email: createdUser.email,
      token: authHelper.generateToken({ id: createdUser.id }),
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
      id: foundUser.id,
      email: foundUser.email,
      token: authHelper.generateToken({ id: foundUser.id }),
      bio: foundUser.bio
    }
  };
  return successResponse(res, 200, data);
};

/**
 * @description returns profile of a user
 * @param {object} request express request object
 * @param {object} response express response object
 * @param {object} next express next argument
 * @returns {json} json
 */
const getProfile = async (request, response) => {
  const { userId } = request.params;
  const user = await findUser(userId);
  if (!user) {
    return responseMessage(response, 404, { error: 'user not found' });
  }
  const { bio, avatarUrl } = user;
  const { id } = request.user;
  const follower = await findFollower(userId, id);
  const following = !!follower;
  return responseMessage(response, 200, {
    profile: {
      id: userId, bio, image: avatarUrl, following
    }
  });
};

/**
 * @description updates the profile of a user
 * @param {object} request express request object
 * @param {object} response express response object
 * @param {object} next express next argument
 * @returns {json} json
 */
const editProfile = async (request, response) => {
  const { body, user } = request;
  const updatedUser = await User.update({ ...body }, {
    where: { id: user.id },
    returning: true,
    raw: true
  });
  if (updatedUser[0]) {
    const {
      password, createdAt, updatedAt, ...profile
    } = updatedUser[1][0];
    return responseMessage(response, 200, {
      message: 'profile successfully updated',
      data: { profile }
    });
  }
  const errorField = Object.keys(body).toString().replace(',', ', ');
  return responseMessage(response, 400, { error: `the ${errorField} field(s) entered are invalid` });
};

export default {
  getProfile, editProfile, signUp, login
};
