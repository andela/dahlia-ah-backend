

export const up = (queryInterface, Sequelize) => queryInterface.createTable('Reports', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
  },
  type: {
    type: Sequelize.STRING
  },
  body: {
    type: Sequelize.STRING
  },
  userId: {
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
  },
  novelId: {
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    allowNull: false,
    references: {
      model: 'Novels',
      key: 'id'
    },
  },
  isConfirmed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  isHandled: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
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
export const down = queryInterface => queryInterface.dropTable('Reports');
