'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Message.belongsTo(models.User, {
                foreignKey: 'senderId',
                as: 'sender',
            });

            Message.belongsTo(models.Conversation, {
                foreignKey: 'conversationId',
                as: 'conversation',
            });

            Message.belongsTo(models.Message, {
                foreignKey: 'replyTo',
                as: 'repliedMessage',
            });

            Message.hasMany(models.Message, {
                foreignKey: 'replyTo',
                as: 'replies',
            });
        }
    }
    Message.init(
        {
            senderId: DataTypes.INTEGER,
            conversationId: DataTypes.STRING,
            content: DataTypes.TEXT,
            contentType: {
                type: DataTypes.ENUM('text', 'image', 'file', 'voice', 'video'),
                defaultValue: 'text',
            },
            replyTo: DataTypes.INTEGER,
            metadata: {
                type: DataTypes.JSON,
                defaultValue: {},
            },
            isEdited: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            editedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Message',
            indexes: [
                {
                    fields: ['conversationId', 'createdAt'],
                },
                {
                    fields: ['senderId'],
                },
            ],
        },
    );
    return Message;
};
