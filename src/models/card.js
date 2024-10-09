'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Card extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Column, { foreignKey: 'columnId', as: 'column' });
            this.hasMany(models.Checklist, { foreignKey: 'cardId', as: 'checklists' });
        }
    }
    Card.init(
        {
            boardId: DataTypes.INTEGER,
            columnId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            description: DataTypes.TEXT,
            image: DataTypes.STRING,
            slug: DataTypes.STRING,
            uuid: DataTypes.STRING,
            archived: { type: DataTypes.BOOLEAN, defaultValue: false },
        },
        {
            sequelize,
            modelName: 'Card',
        },
    );
    return Card;
};
