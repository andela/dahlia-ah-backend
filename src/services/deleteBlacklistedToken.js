import Sequelize from 'sequelize';
import db from '../database/models';


const { BlacklistedToken } = db;
const { Op } = Sequelize;

const deleteExpiredBlacklistedToken = async () => {
  const todaysDate = new Date();
  const currentUnixTime = Math.floor(todaysDate.getTime() / 1000);
  const tokens = await BlacklistedToken.findAll({
    where: { expTime: { [Op.lte]: currentUnixTime.toString() } }
  });

  const tokenArray = tokens.map(value => value.id);
  BlacklistedToken.destroy({
    where: {
      id: tokenArray
    }
  });
};

deleteExpiredBlacklistedToken();
