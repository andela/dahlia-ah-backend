export default (Sequelize, DataTypes) => {
  const User = Sequelize.define('User', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    bio: {
      allowNull: true,
      type: DataTypes.STRING
    },
    avatarUrl: {
      allowNull: true,
      type: DataTypes.STRING
    },
    phoneNo: {
      allowNull: true,
      type: DataTypes.STRING
    },
    isVerified: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isSubscribed: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    roleId: {
      allowNull: false,
      type: DataTypes.UUID,
      defaultValue: 'b79c4eed-60c6-42fb-9040-f0822d8414fa'
    },
    verifiedToken: {
      allowNull: true,
      type: DataTypes.STRING
    },
    paymentStatus: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    allowEmailNotification: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
  User.associate = (models) => {
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    User.hasMany(models.Notification, {
      as: 'notifier',
      foreignKey: 'notifierId',
      onDelete: 'cascade'
    });
    User.hasMany(models.Follower, {
      foreignKey: 'followeeId',
      onDelete: 'CASCADE',
      as: 'usersToBeNotified'
    });
    User.hasMany(models.Novel, {
      foreignKey: 'authorId',
      onDelete: 'CASCADE',
      as: 'author',
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.PreviousPassword, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.Follower, {
      foreignKey: 'followerId',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.Follower, {
      foreignKey: 'followeeId',
    });

    User.hasOne(models.CommentLike, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
    });

    User.hasMany(models.Like, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    User.hasOne(models.CommentLike, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return User;
};
