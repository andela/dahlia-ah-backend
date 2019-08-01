export const up = (queryInterface, Sequelize) => queryInterface.createTable('Users', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
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
  username: {
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
    type: Sequelize.STRING
  },
  avatarUrl: {
    allowNull: true,
    type: Sequelize.STRING
  },
  phoneNo: {
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
  paymentStatus: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  roleId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    defaultValue: 1
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
