export default (sequelize, DataTypes) => {
  const CommentHistory = sequelize.define('CommentHistory', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    commentId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    commentBody: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {});
  CommentHistory.associate = (models) => {
    CommentHistory.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  };
  return CommentHistory;
};
