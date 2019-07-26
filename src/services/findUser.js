import models from '../database/models';

const { User } = models;

/**
 * Finds a user from the database by email or id
 * @name sendMail
 * @param {string} param
 * @param {string} response
 * @returns {object} a user object
 */

const findUser = async (param, response) => {
  const field = (/^\d+$/g.test(param)) ? { id: param } : { email: param };
  const user = await User.findOne({
    where: field
  });
  if (!user) {
    return response.status(404).json({
      error: 'user not found'
    });
  }
  return user;
};

export default findUser;
