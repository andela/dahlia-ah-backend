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
      allowNull: false,
      type: DataTypes.STRING
    },
    passwordCount: {
      allowNull: false,
      type: DataTypes.INTEGER
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
  PreviousPassword.associate = (models) => {
    PreviousPassword.hasMany(models.Novel, {
      foreignKey: 'authorId',
      onDelete: 'CASCADE'
    });
  };
  return PreviousPassword;
};
