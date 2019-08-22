import models from '../database/models';

const { PreviousPassword } = models;

/**
 * @description gets the user's previous passwords from the database
 * @param {string} userId
 * @returns {object} a user object
 */

const getPreviousPasswords = async (userId) => {
  const previousPasswords = await PreviousPassword.findAll({
    where: { userId },
    order: [['passwordCount', 'ASC']],
    raw: true
  });
  return previousPasswords;
};

/**
 * @description deletes a user's previous password
 * @param {string} id
 * @returns {object} a user object
 */
const deletePreviousPassword = async (id) => {
  await PreviousPassword.destroy({
    where: { id }
  });
};

/**
 * @description adds a user's previous password to the table
 * @param {string} userId
 * @param {string} password
 * @param {string} passwordCount
 * @returns {object} a user object
 */
const createPreviousPassword = async (userId, password, passwordCount) => {
  await PreviousPassword.create({
    userId,
    password,
    passwordCount
  });
};

export default {
  getPreviousPasswords, deletePreviousPassword, createPreviousPassword
};
