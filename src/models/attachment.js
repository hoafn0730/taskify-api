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
            this.belongsTo(models.File, { foreignKey: 'fileId' });
            this.belongsTo(models.Card, { foreignKey: 'objectId', constraints: false });
        }
    }
    Attachment.init(
        {
            fileId: DataTypes.INTEGER,
            objectId: DataTypes.INTEGER,
            objectType: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Attachment',
        },
    );
    return Attachment;
};
