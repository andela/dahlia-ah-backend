import models from '../database/models';

const { User, Role, Follower } = models;

/**
 * @description Finds a user from the database by id or email
 * @param {string} param
 * @returns {object} a user object
 */

const findUser = async (param) => {
  const field = (/^[A-Z0-9_.-]+@[A-Z0-9.-]+[A-Z]$/ig.test(param)) ? { email: param } : { id: param };
  const user = await User.findOne({
    where: field,
    include: [{ model: Role }]
  });
  return user;
};

/**
 * @description Updates a user record
 * @param {string} newValue
 * @param {string} userId
 * @returns {object} a user object
 */
const updateUser = async (newValue, userId) => {
  const updatedUser = await User.update({
    ...newValue
  }, {
    where: { id: userId },
    returning: true
  });
  return updatedUser;
};

/**
 * @description Finds a follower following a user
 * @param {string} followeeId
 * @param {string} followerId
 * @returns {object} a user object
 */
const findFollower = async (followeeId, followerId) => {
  const follower = await Follower.findOne({ where: { followeeId, followerId } });
  return follower;
};

/**
 * @name getAllUsers
 * @returns {Array} array of users
 */
const getAllUsers = async () => {
  const allUsers = await User.findAll({
    attributes: ['id', 'firstName', 'lastName', 'bio', 'avatarUrl']
  });
  return allUsers;
};

export default {
  findUser,
  findFollower,
  getAllUsers,
  updateUser
};
