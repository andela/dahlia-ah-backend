export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    bio: {
      allowNull: true,
      type: DataTypes.STRING
    },
    avatarUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
    phoneNo: {
      allowNull: true,
      type: DataTypes.STRING
    },
    isVerified: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: false
    },
    isSubscribed: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    paymentStatus: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    roleId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  User.associate = () => {
    // associations can be defined here
  };
  return User;
};
