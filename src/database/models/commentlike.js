export default (sequelize, DataTypes) => {
  const CommentLike = sequelize.define('CommentLike', {
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
    commentId: {
      allowNull: false,
      type: DataTypes.UUID
    },
  }, {});
  CommentLike.associate = (models) => {
    CommentLike.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
    CommentLike.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return CommentLike;
};
