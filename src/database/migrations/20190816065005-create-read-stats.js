export const up = (queryInterface, Sequelize) => queryInterface.createTable('readStats', {
  id: {
    primaryKey: true,
    allowNull: false,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4
  },
  userId: {
    allowNull: false,
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    defaultValue: Sequelize.UUIDV4,
    references: {
      model: 'Users',
      key: 'id'
    },
  },
  novelId: {
    allowNull: false,
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    defaultValue: Sequelize.UUIDV4,
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
export const down = queryInterface => queryInterface.dropTable('readStats');
