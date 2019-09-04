const up = (queryInterface, Sequelize) => queryInterface.createTable('Genres', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING
  },
  coverImgUrl: {
    allowNull: true,
    type: Sequelize.STRING
  },
  themeColor: {
    allowNull: true,
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

const down = queryInterface => queryInterface.dropTable('Genres');

export default { up, down };
