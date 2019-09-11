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
      allowNull: false,
      type: DataTypes.STRING,
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
    isBanned: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readTime: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    thumbImgUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
    coverImgUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
    isPublished: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    Novel.belongsTo(models.User, {
      foreignKey: 'authorId',
      onDelete: 'CASCADE',
    });
    Novel.hasMany(models.Comment, {
      foreignKey: 'novelId',
      onDelete: 'CASCADE'
    });
    Novel.hasMany(models.Like, {
      foreignKey: 'novelId',
      onDelete: 'CASCADE'
    });
    Novel.belongsTo(models.Genre, {
      foreignKey: 'genreId'
    });
    Novel.hasMany(models.readStats, {
      foreignKey: 'novelId',
      onDelete: 'CASCADE'
    });
  };
  return Novel;
};
