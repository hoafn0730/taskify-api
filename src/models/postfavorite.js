'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class PostFavorite extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    PostFavorite.init(
        {
            postId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            userName: DataTypes.STRING,
            userAvatar: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'PostFavorite',
        },
    );
    return PostFavorite;
};
