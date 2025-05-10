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
            role: DataTypes.STRING,
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
