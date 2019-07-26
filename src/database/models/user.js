export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    avatarUrl: DataTypes.STRING,
    phoneNo: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    isSubscribed: DataTypes.BOOLEAN,
    paymentStatus: DataTypes.BOOLEAN,
    roleId: DataTypes.INTEGER
  }, {});
  User.associate = () => {
    // associations can be defined here
  };
  return User;
};
