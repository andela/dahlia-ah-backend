import models from '../database/models';

const { Follower } = models;

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

export default findFollower;
