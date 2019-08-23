const up = (queryInterface, Sequelize) => queryInterface.createTable('PreviousPasswords', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
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

const down = queryInterface => queryInterface.dropTable('PreviousPasswords');

export default { up, down };
