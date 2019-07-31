const up = (queryInterface, Sequelize) => queryInterface.createTable('Novels', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  authorId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
  },
  genreId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Genres',
      key: 'id'
    },
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    allowNull: false,
    type: Sequelize.STRING
  },
  description: {
    allowNull: false,
    type: Sequelize.STRING
  },
  body: {
    allowNull: false,
    type: Sequelize.TEXT
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

const down = queryInterface => queryInterface.dropTable('Novels');

export default { up, down };
