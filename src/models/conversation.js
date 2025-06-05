'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Conversation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Conversation.hasMany(models.Message, {
                foreignKey: 'conversationId',
                as: 'messages',
            });
            Conversation.hasMany(models.Participant, {
                foreignKey: 'conversationId',
                as: 'participants',
            });
            Conversation.belongsTo(models.User, {
                foreignKey: 'createdBy',
                as: 'creator',
            });
        }
    }
    Conversation.init(
        {
            title: DataTypes.STRING,
            type: {
                type: DataTypes.ENUM('private', 'group'),
                defaultValue: 'private',
            },
            lastMessageAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            metadata: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
        },
        {
            sequelize,
            modelName: 'Conversation',
        },
    );
    return Conversation;
};
