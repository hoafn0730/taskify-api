'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Mail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */

        static associate(models) {
            // define association here
        }
    }
    Mail.init(
        {
            to: DataTypes.STRING,
            from: DataTypes.STRING,
            folder: DataTypes.STRING,
            subject: DataTypes.STRING,
            message: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Mail',
            paranoid: true,
        },
    );
    return Mail;
};
