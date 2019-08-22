export const up = (queryInterface, Sequelize) => queryInterface.createTable('NotificationObjects', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
  },
  entityId: {
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    allowNull: false,
  },
  actorId: {
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
  },
  entityTypeId: {
    allowNull: false,
    type: Sequelize.INTEGER
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

export const down = queryInterface => queryInterface.dropTable('NotificationObjects');
