import debug from 'debug';
import models from '../database/models';
import helpers from '../helpers';
import services from '../services';

const log = debug('dev');

const {
  authHelper, successResponse, errorResponse, responseMessage, verifyUser
} = helpers;
const {
  userServices: {
    findUser, findFollower, getAllUsers, addUser, findUserRole, fetchReadStats, findFollows
  }
} = services;
const { User, Follower } = models;

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

  await verifyUser({
    id: createdUser.id,
    email: createdUser.email,
    firstName: createdUser.firstName
  });

  const response = {
    user: {
      id: createdUser.id,
      firstName: createdUser.firstName,
      lastName: createdUser.lastName,
      email: createdUser.email,
      token: authHelper.generateToken({ id: createdUser.id }),
      bio: createdUser.bio,
      isVerified: createdUser.isVerified,
      allowEmailNotification: createdUser.allowEmailNotification
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

  const foundUser = await findUser(email);
  if (!foundUser) return errorResponse(res, 401, authErrorMessage);

  const correctPassword = authHelper.comparePassword(password, foundUser.password);

  if (!correctPassword) {
    return errorResponse(res, 401, authErrorMessage);
  }

  const data = {
    user: {
      id: foundUser.id,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      email: foundUser.email,
      token: authHelper.generateToken({ id: foundUser.id }),
      bio: foundUser.bio,
      isVerified: foundUser.isVerified,
      allowEmailNotification: foundUser.allowEmailNotification,
      role: foundUser.Role.roleName
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
  const {
    firstName, lastName, bio, avatarUrl
  } = user;
  const { id } = request.user;
  const follower = await findFollower(userId, id);
  const following = !!follower;
  const { followers, following: follows } = await findFollows(userId);

  return responseMessage(response, 200, {
    profile: {
      id: userId,
      firstName,
      lastName,
      bio,
      image: avatarUrl,
      following,
      followers,
      follows
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

/**
  *
  * @name listUsers
  * @param {Object} request
  * @param {Object} response
  * @return {Object} json response
  */
const listUsers = async (request, response) => {
  const {
    search, page = 1, limit = 20
  } = request.query;
  const offset = limit * (page - 1);
  try {
    const users = await getAllUsers(offset, limit, search);
    const pages = Math.ceil(users.count / limit);
    if (page > pages) {
      return responseMessage(response, 404, { error: 'page not found' });
    }
    return successResponse(response, 200, {
      message: 'Request successful',
      currentPage: page,
      totalPages: pages,
      limit,
      users: users.rows
    });
  } catch (error) {
    return responseMessage(response, 500, { error: error.message });
  }
};

/*
   * follow users feature
   * @param {Object} req - server request
   * @param {Object} res - server response
   * @return {Object} - custom response
   */
const follow = async (req, res) => {
  const { userId } = req.params;
  const authUserId = req.user.id;
  if (userId === authUserId) {
    return responseMessage(res, 403, { error: 'You cannot follow yourself' });
  }

  try {
    const follower = await findFollower(userId, authUserId);
    if (follower) {
      return responseMessage(res, 409, { error: "You're already a follower" });
    }

    await Follower.create({
      followerId: authUserId,
      followeeId: userId
    });

    const user = await findUser(userId);
    const { id, } = user;
    const data = {
      userId: id,
      following: true
    };
    return responseMessage(res, 201, data);
  } catch (error) {
    return responseMessage(res, 500, { error: 'an error occured' });
  }
};

/*
   * unfollow user feature
   * @param {Object} req - server request
   * @param {Object} res - server response
   * @return {Object} - custom response
   */
const unfollow = async (req, res) => {
  const { userId } = req.params;
  const authUserId = req.user.id;
  if (userId === authUserId) {
    return responseMessage(res, 403, { error: 'operation not allowed' });
  }
  try {
    const follower = await findFollower(userId, authUserId);
    if (!follower) {
      return responseMessage(res, 403, { error: "you're not a follower" });
    }

    await Follower.destroy({
      where: {
        followerId: authUserId,
        followeeId: userId
      }
    });
  } catch (error) {
    return responseMessage(res, 500, { error: 'an error occured' });
  }


  const data = {
    message: 'successfully unfollowed',
  };

  return responseMessage(res, 200, data);
};

/**
   * ADMIN Get one user
   * @param {Object} req - server request
   * @param {Object} res - server response
   * @return {Object} - custom response
   */
const getUser = async (req, res) => {
  const { userId } = req.params;
  const { dataValues: user } = await findUser(userId);

  const response = {
    message: 'successful',
    data: user
  };

  return responseMessage(res, 200, response);
};

/**
       * ADMIN create user
       * @param {Object} req - server request
       * @param {Object} res - server response
       * @return {Object} - custom response
       */
const createUser = async (req, res) => {
  try {
    const foundUser = await findUser(req.body.email);
    if (foundUser) {
      return responseMessage(res, 409, { error: 'user with email already exists' });
    }

    const createdUser = await addUser(req.body);
    const response = {
      data: {
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        roleId: createdUser.roleId
      }
    };

    return responseMessage(res, 201, response);
  } catch (error) {
    log(error.message);
    return responseMessage(res, 500, { error: 'an error occurred' });
  }
};

/**
   * ADMIN create user
   * @param {Object} req - server request
   * @param {Object} res - server response
   * @return {Object} - custom response
   */
const updateUser = async (req, res) => {
  const {
    firstName, lastName, roleName, phoneNumber, isSubscribed
  } = req.body;
  const id = req.params.userId;
  let roleId;
  try {
    if (roleName) {
      const role = await findUserRole(roleName);
      roleId = role.id;
    }

    const updatedUser = await User.update({
      firstName,
      lastName,
      roleName,
      phoneNumber,
      isSubscribed: !!isSubscribed,
      roleId
    }, {
      where: { id },
      returning: true,
      raw: true,
    });

    const user = updatedUser[1][0];
    if (!user) {
      return responseMessage(res, 404, { error: 'user not found' });
    }
    user.password = undefined;

    const response = {
      message: 'successful',
      data: user
    };

    return responseMessage(res, 200, response);
  } catch (error) {
    log(error);
    return responseMessage(res, 500, { error: 'an error occurred' });
  }
};

/**
     * ADMIN create user
     * @param {Object} req - server request
     * @param {Object} res - server response
     * @return {Object} - custom response
     */
const deleteUser = async (req, res) => {
  const id = req.params.userId;
  try {
    const deleted = await User.destroy({
      where: { id },
      returning: true,
      raw: true
    });

    if (!deleted) {
      const error = 'user not found';
      return responseMessage(res, 404, { error });
    }

    const message = 'user deleted successfully';

    return responseMessage(res, 200, { message });
  } catch (error) {
    log(error.message);
    return responseMessage(res, 500, { error: 'an error occurred' });
  }
};

/**
 * @description updates the profile of a user
 * @param {object} request express request object
 * @param {object} response express response object
 * @returns {json} json
 */
const getReadingStats = async (request, response) => {
  const { period } = request.query;
  try {
    const readingStats = await fetchReadStats(request.user.id, period);
    const data = { message: 'success', readingStats };
    return responseMessage(response, 200, data);
  } catch (error) {
    log(error.message);
    return responseMessage(response, 500, { error: 'an error occurred' });
  }
};

const userSettings = async (req, res) => {
  const { allowEmailNotification } = req.query;
  const { id } = req.user;
  try {
    await User.update(
      { allowEmailNotification },
      { where: { id } }
    );
    return responseMessage(res, 200, { message: 'settings was updated successfully' });
  } catch (error) {
    return responseMessage(res, 500, { error: 'an error occurred' });
  }
};


export default {
  getProfile,
  editProfile,
  signUp,
  login,
  listUsers,
  follow,
  unfollow,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getReadingStats,
  userSettings
};
