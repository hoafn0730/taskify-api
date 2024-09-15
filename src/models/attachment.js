'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Attachment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Attachment.init(
        {
            cardId: DataTypes.INTEGER,
            fileName: DataTypes.STRING,
            fileType: DataTypes.STRING,
            fileUrl: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'Attachment',
        },
    );
    return Attachment;
};
