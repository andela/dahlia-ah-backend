export const up = (queryInterface, Sequelize) => queryInterface.createTable('Users', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
  },
  firstName: {
    allowNull: false,
    type: Sequelize.STRING
  },
  lastName: {
    allowNull: false,
    type: Sequelize.STRING
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: true
  },
  password: {
    allowNull: false,
    type: Sequelize.STRING
  },
  bio: {
    allowNull: true,
    type: Sequelize.TEXT,
  },
  phoneNo: {
    allowNull: true,
    type: Sequelize.STRING,
    unique: true
  },
  avatarUrl: {
    allowNull: true,
    type: Sequelize.STRING
  },
  isVerified: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  isSubscribed: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
});

export const down = queryInterface => queryInterface.dropTable('Users');
