import models from '../database/models';

const { User } = models;

/**
 * Finds a user from the database by email or id
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

export default {
  findUser
};
