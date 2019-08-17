export default (Sequelize, DataTypes) => {
  const PreviousPassword = Sequelize.define('PreviousPassword', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      onDelete: 'CASCADE',
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {});
  PreviousPassword.associate = (models) => {
    PreviousPassword.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return PreviousPassword;
};
