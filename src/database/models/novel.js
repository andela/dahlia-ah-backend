export default (Sequelize, DataTypes) => {
  const Novel = Sequelize.define('Novel', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    authorId: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      allowNull: false
    },
    genreId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    body: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  Novel.associate = (models) => {
    // associations can be defined here
    Novel.belongsTo(models.User, {
      foreignKey: 'authorId',
      onDelete: 'CASCADE',
    });
    Novel.hasMany(models.Comment, {
      foreignKey: 'novelId',
      onDelete: 'CASCADE'
    });
    Novel.belongsTo(models.Genre, {
      foreignKey: 'genreId'
    });
  };
  return Novel;
};
