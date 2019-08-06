export const up = (queryInterface, Sequelize) => queryInterface.createTable('Followers', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID
  },
  followeeId: {
    allowNull: false,
    type: Sequelize.UUID
  },
  followerId: {
    allowNull: false,
    type: Sequelize.UUID
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
export const down = queryInterface => queryInterface.dropTable('Followers');
