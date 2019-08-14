const up = (queryInterface, Sequelize) => queryInterface.createTable('Novels', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.UUID,
  },
  authorId: {
    type: Sequelize.UUID,
    onDelete: 'CASCADE',
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
  },
  genreId: {
    type: Sequelize.UUID,
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
  readTime: {
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

const down = queryInterface => queryInterface.dropTable('Novels');

export default { up, down };
