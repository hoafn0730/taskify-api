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
            Conversation.hasMany(models.Participant, { foreignKey: 'conversationId' });
            Conversation.hasMany(models.Message, { foreignKey: 'conversationId' });
        }
    }
    Conversation.init(
        {
            title: DataTypes.STRING,
            type: DataTypes.STRING,
            unreadCount: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Conversation',
        },
    );
    return Conversation;
};
