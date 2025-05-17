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
            this.belongsTo(models.Board, { foreignKey: 'boardId', as: 'board' });
            this.belongsTo(models.Column, { foreignKey: 'columnId', as: 'column' });
            this.hasMany(models.Checklist, { foreignKey: 'cardId', as: 'checklists' });
            this.hasMany(models.Comment, { foreignKey: 'commentableId', as: 'comments' });

            this.belongsToMany(models.User, {
                through: {
                    model: models.Member,
                    scope: { objectType: 'card' },
                },
                foreignKey: 'objectId',
                otherKey: 'userId',
                constraints: false,
                as: 'assignees',
            });
            this.belongsToMany(models.User, {
                through: {
                    model: models.Member,
                    scope: { objectType: 'card', role: 'reporter' },
                },
                foreignKey: 'objectId',
                otherKey: 'userId',
                constraints: false,
                as: 'reporter',
            });

            this.belongsToMany(models.File, {
                through: {
                    model: models.Attachment,
                    scope: { objectType: 'card' },
                },
                foreignKey: 'objectId',
                otherKey: 'fileId',
                constraints: false,
                as: 'attachments',
            });
            this.belongsToMany(models.File, {
                through: {
                    model: models.Attachment,
                    scope: { objectType: 'card' },
                },
                foreignKey: 'objectId',
                otherKey: 'fileId',
                constraints: false,
                as: 'cover',
            });
        }
    }
    Card.init(
        {
            boardId: DataTypes.INTEGER,
            columnId: DataTypes.INTEGER,
            title: DataTypes.STRING,
            description: DataTypes.TEXT,
            image: DataTypes.STRING,
            slug: { type: DataTypes.STRING, unique: true },
            shortLink: DataTypes.STRING,
            uuid: DataTypes.STRING,
            dueStart: DataTypes.DATE,
            dueDate: DataTypes.DATE,
            dueComplete: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            dueReminder: {
                type: DataTypes.INTEGER,
                defaultValue: -1,
            },
            archivedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            priority: DataTypes.STRING,
            labels: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Card',
            paranoid: true,
        },
    );
    return Card;
};
