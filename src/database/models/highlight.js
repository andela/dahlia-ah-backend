export default (Sequelize, DataTypes) => {
  const Highlight = Sequelize.define('Highlight', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    novelId: {
      allowNull: false,
      onDelete: 'CASCADE',
      type: DataTypes.UUID,
      references: {
        model: 'Novels',
        key: 'id'
      },
    },
    readerId: {
      allowNull: false,
      onDelete: 'CASCADE',
      type: DataTypes.UUID,
      references: {
        model: 'Users',
        key: 'id'
      },
    },
    startIndex: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    endIndex: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    comment: {
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
  Highlight.associate = (models) => {
    Highlight.belongsTo(models.Novel, {
      foreignKey: 'novelId'
    });
    Highlight.belongsTo(models.User, {
      foreignKey: 'readerId'
    });
  };
  return Highlight;
};
