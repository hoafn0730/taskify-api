'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Column extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Card, { foreignKey: 'columnId', as: 'cards' });
        }
    }
    Column.init(
        {
            boardId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            position: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Column',
        },
    );
    return Column;
};
