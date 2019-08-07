import models from '../database/models';

const { User } = models;

/**
 * Finds a user from the database by email or id
 * @param {string} param
 * @returns {object} a user object
 */

const findUser = async (param) => {
  const field = (/^\d+$/g.test(param)) ? { id: param } : { email: param };
  const user = await User.findOne({
    where: field,
    attributes: { exclude: ['password'] }
  });
  return user;
};

export default {
  findUser
};
