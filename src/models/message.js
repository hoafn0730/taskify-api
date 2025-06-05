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
            });
            Message.belongsTo(models.Message, {
                foreignKey: 'replyTo',
                as: 'repliedMessage',
            });
        }
    }
    Message.init(
        {
            senderId: DataTypes.INTEGER,
            conversationId: DataTypes.STRING,
            roomId: DataTypes.STRING,
            content: DataTypes.TEXT,
            contentType: { type: DataTypes.STRING, defaultValue: 'text' },
            replyTo: DataTypes.INTEGER,
            readBy: {
                type: DataTypes.JSON,
                defaultValue: [],
            },
        },
        {
            sequelize,
            modelName: 'Message',
        },
    );
    return Message;
};
