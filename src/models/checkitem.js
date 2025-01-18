'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CheckItem extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate() {
            // define association here
        }
    }
    CheckItem.init(
        {
            checklistId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            status: { type: DataTypes.STRING, defaultValue: 'incomplete' },
        },
        {
            sequelize,
            modelName: 'CheckItem',
        },
    );
    return CheckItem;
};
