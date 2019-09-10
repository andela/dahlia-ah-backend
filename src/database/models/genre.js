
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
    description: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: 'Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    },
    coverImgUrl: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: 'https://res.cloudinary.com/allebd/image/upload/v1567555883/dahlia/back9unsplash.jpg'
    },
    themeColor: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: '#9bb3a1'
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
