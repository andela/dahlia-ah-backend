export const up = (queryInterface, Sequelize) => queryInterface.createTable('CommentLikes', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID
  },
  userId: {
    type: Sequelize.UUID
  },
  commentId: {
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
export const down = queryInterface => queryInterface.dropTable('CommentLikes');
