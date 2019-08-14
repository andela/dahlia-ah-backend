export default (sequelize, DataTypes) => {
  const Follower = sequelize.define('Follower', {
    followeeId: DataTypes.UUID,
    followerId: DataTypes.UUID
  }, {});
  Follower.associate = (models) => {
    Follower.belongsTo(models.User, {
      foreignKey: 'followeeId',
      onDelete: 'CASCADE'
    });

    Follower.belongsTo(models.User, {
      foreignKey: 'followerId',
      onDelete: 'CASCADE'
    });
  };
  return Follower;
};
