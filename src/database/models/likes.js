export default (sequelize, DataTypes) => {
  const Likes = sequelize.define('Likes', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    slug: {
      allowNull: false,
      type: DataTypes.STRING,
    }
  }, {});
  Likes.associate = (models) => {
    Likes.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Likes.belongsTo(models.Novel, {
      foreignKey: 'slug',
      onDelete: 'CASCADE'
    });
  };
  return Likes;
};
