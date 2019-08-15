export const up = (queryInterface, Sequelize) => queryInterface.createTable('Highlights', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID
  },
  novelId: {
    allowNull: false,
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    references: {
      model: 'Novels',
      key: 'id'
    },
  },
  readerId: {
    allowNull: false,
    onDelete: 'CASCADE',
    type: Sequelize.UUID,
    references: {
      model: 'Users',
      key: 'id'
    },
  },
  startIndex: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  endIndex: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  comment: {
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

export const down = queryInterface => queryInterface.dropTable('Highlights');
