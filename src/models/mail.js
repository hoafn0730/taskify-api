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
            // Mail belongs to User (sender)
            Mail.belongsTo(models.User, {
                foreignKey: 'from',
                as: 'sender',
            });

            // Mail belongs to User (recipient)
            Mail.belongsTo(models.User, {
                foreignKey: 'to',
                as: 'recipient',
            });
        }
    }
    Mail.init(
        {
            to: DataTypes.INTEGER,
            from: DataTypes.INTEGER,
            folder: { type: DataTypes.STRING, defaultValue: 'drafts' },
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
