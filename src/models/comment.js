'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        }
    }
    Comment.init(
        {
            userId: DataTypes.INTEGER,
            commentableId: DataTypes.INTEGER,
            commentableType: DataTypes.STRING,
            comment: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Comment',
        },
    );
    return Comment;
};
