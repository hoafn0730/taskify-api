'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Participant extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Participant.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
            });
            Participant.belongsTo(models.Conversation, {
                foreignKey: 'conversationId',
                as: 'conversation',
            });
        }
    }
    Participant.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            conversationId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM('admin', 'member'),
                defaultValue: 'member',
            },
            lastReadAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Participant',
        },
    );
    return Participant;
};
