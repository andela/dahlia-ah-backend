
export default (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    coverImgUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
    themeColor: {
      allowNull: true,
      type: DataTypes.STRING
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
  Genre.associate = (models) => {
    // associations can be defined here
    Genre.hasMany(models.Novel, {
      foreignKey: 'genreId',
      as: 'novels',
    });
  };
  return Genre;
};
