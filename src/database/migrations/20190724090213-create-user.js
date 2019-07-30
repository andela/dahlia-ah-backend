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
    allowNull: false,
    type: Sequelize.TEXT,
    defaultValue: 'I love novels!'
  },
  phoneNO: {
    allowNull: true,
    type: Sequelize.STRING,
    unique: true
  },
  avatarURL: {
    allowNull: true,
    type: Sequelize.STRING
  },
  address: {
    allowNull: true,
    type: Sequelize.TEXT
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
