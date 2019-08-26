import db from '../database/models';

const { BlacklistedToken } = db;

const findBlacklistedToken = token => BlacklistedToken.findOne({ where: { token } });

export default {
  findBlacklistedToken
};
