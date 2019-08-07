export default (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    commentBody: {
      allowNull: false,
      type: DataTypes.STRING
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    novelId: {
      allowNull: true,
      type: DataTypes.INTEGER
    },
    parentId: {
      allowNull: true,
      type: DataTypes.INTEGER
    }
  }, {});
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
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
      onDelete: 'CASCADE'
    });
  };
  return Comment;
};
