export const up = (queryInterface, Sequelize) => queryInterface.createTable('PreviousPasswords', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID
  },
  userId: {
    allowNull: false,
    type: Sequelize.UUID
  },
  password: {
    allowNull: false,
    type: Sequelize.STRING
  },
  passwordCount: {
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

export const down = queryInterface => queryInterface.dropTable('PreviousPasswords');
