import models from '../database/models';

const { User, Follower } = models;

/**
 * @description Finds a user from the database by id or email
 * @param {string} param
 * @returns {object} a user object
 */

const findUser = async (param) => {
  const field = (/^[A-Z0-9_.-]+@[A-Z0-9.-]+[A-Z]$/ig.test(param)) ? { email: param } : { id: param };
  const user = await User.findOne({
    where: field,
    attributes: { exclude: ['password'] }
  });
  return user;
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

export default {
  findUser, findFollower
};
