export const up = (queryInterface, Sequelize) => queryInterface.createTable('Bookmarks', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
  },
  userId: {
    allowNull: false,
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    references: {
      model: 'Users',
      key: 'id'
    },
  },
  novelId: {
    allowNull: true,
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    references: {
      model: 'Novels',
      key: 'id'
    },
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
export const down = queryInterface => queryInterface.dropTable('Bookmarks');
