export default (sequelize, DataTypes) => {
  const NotificationObject = sequelize.define('NotificationObject', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    entityId: DataTypes.UUID,
    actorId: DataTypes.UUID,
    entityTypeId: DataTypes.INTEGER
  }, {});
  NotificationObject.associate = (models) => {
    NotificationObject.hasMany(models.Notification, {
      foreignKey: 'notificationObjectId',
      onDelete: 'cascade'
    });
  };
  return NotificationObject;
};
