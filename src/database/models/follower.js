export default (sequelize, DataTypes) => {
  const Follower = sequelize.define('Follower', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    followeeId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    followerId: {
      allowNull: false,
      type: DataTypes.UUID,
    }
  }, {});
  Follower.associate = (models) => {
    Follower.belongsTo(models.User, {
      foreignKey: 'id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Follower.belongsTo(models.User, {
      foreignKey: 'id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Follower;
};
