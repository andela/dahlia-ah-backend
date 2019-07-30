export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
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
        allowNull: false,
        type: DataTypes.TEXT,
        defaultValue: 'I love novels!'
      },
      phoneNO: {
        allowNull: true,
        type: DataTypes.STRING,
        unique: true
      },
      avatarURL: {
        allowNull: true,
        type: DataTypes.STRING
      },
      address: {
        allowNull: true,
        type: DataTypes.TEXT
      },
      isVerified: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
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
    },
    {}
  );
  User.associate = () => {
    // associations can be defined here
  };
  return User;
};
