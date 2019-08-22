export default (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
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
    novelId: {
      allowNull: false,
      type: DataTypes.UUID,
    }
  }, {});
  Like.associate = (models) => {
    Like.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Like.belongsTo(models.Novel, {
      foreignKey: 'novelId',
      onDelete: 'CASCADE'
    });
  };
  return Like;
};
