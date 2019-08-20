export default (sequelize, DataTypes) => {
  const readStats = sequelize.define('readStats', {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    userId: {
      allowNull: false,
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    novelId: {
      allowNull: false,
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'Novels',
        key: 'id'
      },
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
  readStats.associate = (models) => {
    // associations can be defined here
    readStats.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    readStats.belongsTo(models.Novel, {
      foreignKey: 'novelId',
      onDelete: 'CASCADE',
    });
  };
  return readStats;
};
