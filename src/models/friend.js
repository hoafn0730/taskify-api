'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Friend extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // Quan hệ 1 người dùng có nhiều bạn bè (quan hệ 2 chiều)
            Friend.belongsTo(models.User, { foreignKey: 'userId', as: 'requester' });
            Friend.belongsTo(models.User, { foreignKey: 'friendId', as: 'receiver' });
        }
    }
    Friend.init(
        {
            userId: DataTypes.INTEGER,
            friendId: DataTypes.INTEGER,
            status: { type: DataTypes.STRING, defaultValue: 'pending' }, // 'pending', 'accepted', 'blocked'
        },
        {
            sequelize,
            modelName: 'Friend',
            indexes: [
                {
                    unique: true,
                    fields: ['userId', 'friendId'],
                },
            ],
        },
    );
    return Friend;
};
