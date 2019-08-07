
export const up = (queryInterface, Sequelize) => queryInterface.createTable('Notifications', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
  },
  notificationObjectId: {
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    allowNull: false,
    references: {
      model: 'NotificationObjects',
      key: 'id'
    },
  },
  notifierId: {
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
  },
  isRead: {
    allowNull: false,
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
export const down = queryInterface => queryInterface.dropTable('Notifications');
