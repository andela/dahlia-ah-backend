export default (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    novelId: {
      allowNull: false,
      type: DataTypes.UUID
    }
  }, {});
  Bookmark.associate = (models) => {
    Bookmark.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Bookmark.belongsTo(models.Novel, {
      foreignKey: 'novelId',
      onDelete: 'CASCADE'
    });
  };
  return Bookmark;
};
