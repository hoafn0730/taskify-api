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
            status: DataTypes.STRING,
            lastActivity: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'User',
            paranoid: true,
        },
    );

    return User;
};
