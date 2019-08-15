import helpers from '../helpers';

const { responseMessage } = helpers;
/**
 *
 * @param {object} roleArray an array of roles
 * @returns {*} json or next
 */
const authorizeUser = roleArray => async (request, response, next) => {
  const { Role: { roleName } } = request.user;
  if (!roleArray.includes(roleName)) {
    return responseMessage(response, 403, { error: 'you need permission' });
  }
  next();
};

export default authorizeUser;
