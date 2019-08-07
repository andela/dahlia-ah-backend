export default (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    notificationObjectId: DataTypes.UUID,
    notifierId: DataTypes.UUID
  }, {});
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'notifierId',
      onDelete: 'cascade'
    });
    Notification.belongsTo(models.NotificationObject, {
      foreignKey: 'notificationObjectId',
      onDelete: 'cascade'
    });
  };
  return Notification;
};
