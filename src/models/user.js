'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsToMany(User, {
                as: 'friends',
                through: models.Friend,
                foreignKey: 'userId',
                otherKey: 'friendId',
            });
            // User.belongsToMany(User, {
            //     as: 'friendOf',
            //     through: models.Friend,
            //     foreignKey: 'friendId',
            //     otherKey: 'userId',
            // });

            this.belongsToMany(models.Board, {
                through: {
                    model: models.Member,
                    scope: { objectType: 'board' },
                },
                foreignKey: 'userId',
                otherKey: 'objectId',
                constraints: false,
                as: 'boards',
            });
            this.belongsToMany(models.Card, {
                through: {
                    model: models.Member,
                    scope: { objectType: 'card' },
                },
                foreignKey: 'userId',
                otherKey: 'objectId',
                constraints: false,
                as: 'cards',
            });
            this.belongsToMany(models.Team, {
                through: {
                    model: models.Member,
                    scope: { objectType: 'team' },
                },
                foreignKey: 'userId',
                otherKey: 'objectId',
                constraints: false,
                as: 'teams',
            });
            this.hasMany(models.Member, { foreignKey: 'userId' });
        }
    }
    User.init(
        {
            uid: { type: DataTypes.STRING, unique: true },
            username: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            displayName: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            address: DataTypes.STRING,
            avatar: DataTypes.STRING,
            type: DataTypes.STRING,
            role: { type: DataTypes.STRING, defaultValue: 'user' },
            status: {
                type: DataTypes.ENUM('active', 'pending', 'banned'),
                allowNull: false,
                defaultValue: 'pending',
            },

            verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            verifiedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            activityStatus: {
                type: DataTypes.ENUM('online', 'offline', 'away'),
                allowNull: false,
                defaultValue: 'offline',
            },
            lastActivity: DataTypes.DATE, // Thêm chỉ trường xác thực email
            socketId: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: null,
            },
        },
        {
            sequelize,
            modelName: 'User',
            paranoid: true,
        },
    );

    return User;
};
