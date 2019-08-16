export const up = (queryInterface, Sequelize) => queryInterface.createTable('Roles', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID
  },
  roleName: {
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

export const down = queryInterface => queryInterface.dropTable('Roles');
