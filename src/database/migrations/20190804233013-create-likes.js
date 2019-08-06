export const up = (queryInterface, Sequelize) => queryInterface.createTable('Likes', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID
  },
  userId: {
    allowNull: false,
    type: Sequelize.UUID
  },
  slug: {
    allowNull: false,
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

export const down = queryInterface => queryInterface.dropTable('Likes');
