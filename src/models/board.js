'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Board extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Column, { foreignKey: 'boardId', as: 'columns' });
            this.hasMany(models.Member, { foreignKey: 'objectId', as: 'members' });
        }
    }
    Board.init(
        {
            workspaceId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            type: DataTypes.STRING,
            slug: DataTypes.STRING,
            image: DataTypes.STRING,
            columnOrderIds: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
            },
        },
        {
            sequelize,
            modelName: 'Board',
            paranoid: true,
        },
    );
    return Board;
};
