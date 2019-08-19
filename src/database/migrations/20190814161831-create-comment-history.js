export const up = (queryInterface, Sequelize) => queryInterface.createTable('CommentHistories', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID
  },
  commentId: {
    type: Sequelize.STRING
  },
  commentBody: {
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
export const down = queryInterface => queryInterface.dropTable('CommentHistories');
