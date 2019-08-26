export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    commentBody: {
      allowNull: false,
      type: DataTypes.STRING
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID
    },
    novelId: {
      allowNull: true,
      type: DataTypes.UUID
    },
    parentId: {
      allowNull: true,
      type: DataTypes.UUID
    }
  }, {});
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'commentAuthor',
      onDelete: 'CASCADE'
    });

    Comment.belongsTo(models.Novel, {
      foreignKey: 'novelId',
      onDelete: 'CASCADE'
    });

    Comment.belongsTo(models.Comment, {
      foreignKey: 'parentId',
      onDelete: 'CASCADE'
    });

    Comment.hasMany(models.Comment, {
      foreignKey: 'parentId',
      as: 'replies',
      onDelete: 'CASCADE'
    });

    Comment.hasMany(models.CommentLike, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
    Comment.hasMany(models.CommentLike, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });
  };
  return Comment;
};
