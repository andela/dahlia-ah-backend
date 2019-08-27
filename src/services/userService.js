import Sequelize from 'sequelize';
import models from '../database/models';
import helpers from '../helpers';
import novelServices from './novelService';

const { Op } = Sequelize;
const {
  User, Role, Follower, readStats, Novel
} = models;
const { authHelper: { generateRandomPassword } } = helpers;
const { getAllBookmark } = novelServices;

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
 * @param {integer} offset
 * @param {integer} limit
 * @param {keyword} search
 * @returns {Array} array of users
 */
const getAllUsers = async (offset, limit, search) => {
  let query;
  if (search) {
    query = {
      where: Sequelize.where(Sequelize.fn('concat', Sequelize.col('User.firstName'), ' ', Sequelize.col('User.lastName')), {
        [Op.iLike]: `%${search}%`,
      })
    };
  }
  const allUsers = await User.findAndCountAll({
    offset,
    limit,
    attributes: ['id', 'firstName', 'lastName', 'bio', 'avatarUrl'],
    ...query
  });
  return allUsers;
};

/**
 * Retrieves all users from the database
 * @param {Object} requestBody - body of request
 * @returns {Object} rows - array of objects
 */
const addUser = async (requestBody) => {
  const {
    firstName, lastName, email, roleName
  } = requestBody;

  const { hashedRandomPassword } = generateRandomPassword();

  const roles = await Role.findAll();
  let roleId;

  if (roleName) {
    const role = roles.find(roleObject => roleObject.roleName === roleName);
    roleId = role.id;
  }

  const user = {
    firstName, lastName, email, password: hashedRandomPassword, roleId
  };

  const createdUser = await User.create(user);
  return createdUser;
};

/**
 * Returns user role from roleId
 * @param {String} param - role name or Id
 * @param {String} roleName - role name
 * @returns {Object} rows - role name and Id
 */
const findUserRole = async (param) => {
  const field = (/^\w+$/ig.test(param)) ? { roleName: param } : { id: param };
  const role = await Role.findOne({
    where: field
  });

  return role;
};

/**
 * @description Finds a follower following a user
 * @param {string} followeeId
 * @param {string} followerId
 * @returns {object} a user object
 */

const fetchReadStats = async (userId, period) => {
  period = parseInt(period, 10) + 1;

  const today = Date.now();
  const dateRead = object => (new Date(object.createdAt).getTime());

  const { rows: readNovels, count: readCount } = await readStats.findAndCountAll({
    where: { userId },
    include: [
      {
        model: Novel,
        required: false,
      }
    ]
  });
  let bookmarks = await getAllBookmark(userId);

  if (!period || period <= 1) {
    return { bookmarks, reads: readNovels, readCount };
  }

  const reads = readNovels.filter((novel) => {
    const difference = Math.floor((today - dateRead(novel)) / 86400000);
    return difference < period;
  });

  bookmarks = bookmarks.filter((bookmark) => {
    const difference = Math.floor((today - dateRead(bookmark)) / 86400000);
    return difference < period;
  });

  return { bookmarks, reads, readCount: reads.length };
};

export default {
  findUser,
  findFollower,
  getAllUsers,
  updateUser,
  addUser,
  findUserRole,
  fetchReadStats
};
