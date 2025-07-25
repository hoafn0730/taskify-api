'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class File extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsToMany(models.Card, {
                through: {
                    model: models.Attachment,
                    scope: { objectType: 'card' },
                },
                foreignKey: 'fileId',
                otherKey: 'objectId',
                constraints: false,
                as: 'cards',
            });
        }
    }
    File.init(
        {
            name: DataTypes.STRING,
            path: DataTypes.STRING,
            preview: DataTypes.STRING,
            size: DataTypes.STRING,
            type: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'File',
        },
    );
    return File;
};
