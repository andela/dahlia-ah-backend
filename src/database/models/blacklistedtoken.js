export default (sequelize, DataTypes) => {
  const BlacklistedToken = sequelize.define('BlacklistedToken', {
    expTime: DataTypes.STRING,
    token: DataTypes.STRING
  }, {});
  BlacklistedToken.associate = () => {};
  return BlacklistedToken;
};
