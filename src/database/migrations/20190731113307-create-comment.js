export const up = (queryInterface, Sequelize) => queryInterface.createTable('Comments', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  commentBody: {
    allowNull: false,
    type: Sequelize.STRING
  },
  userId: {
    allowNull: false,
    type: Sequelize.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    },
  },
  novelId: {
    allowNull: true,
    type: Sequelize.INTEGER,
    references: {
      model: 'Novels',
      key: 'id'
    },
  },
  parentId: {
    allowNull: true,
    type: Sequelize.INTEGER,
    references: {
      model: 'Comments',
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
export const down = queryInterface => queryInterface.dropTable('Comments');
