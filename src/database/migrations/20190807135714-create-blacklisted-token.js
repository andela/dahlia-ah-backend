export const up = (queryInterface, Sequelize) => queryInterface.createTable('BlacklistedTokens', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  expTime: {
    type: Sequelize.STRING
  },
  token: {
    type: Sequelize.STRING
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
export const down = queryInterface => queryInterface.dropTable('BlacklistedTokens');
