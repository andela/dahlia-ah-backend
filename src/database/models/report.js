export default (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      allowNull: false
    },
    novelId: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      allowNull: false
    },
    type: DataTypes.STRING,
    body: DataTypes.STRING,
    isConfirmed: DataTypes.BOOLEAN,
    isHandled: DataTypes.BOOLEAN
  }, {});
  Report.associate = (models) => {
    Report.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Report.belongsTo(models.Novel, {
      foreignKey: 'novelId',
      onDelete: 'CASCADE',
    });
  };
  return Report;
};
