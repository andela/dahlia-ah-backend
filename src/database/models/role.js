export default (Sequelize, DataTypes) => {
  const Role = Sequelize.define('Role', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    roleName: DataTypes.STRING
  }, {});
  Role.associate = (models) => {
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      onDelete: 'CASCADE'
    });
  };
  return Role;
};
