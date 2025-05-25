'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            // Polymorphic associations
            Comment.belongsTo(models.Post, {
                foreignKey: 'commentableId',
                constraints: false,
                scope: {
                    commentableType: 'Post',
                },
            });

            Comment.belongsTo(models.Card, {
                foreignKey: 'commentableId',
                constraints: false,
                scope: {
                    commentableType: 'Card',
                },
            });
        }
    }

    Comment.init(
        {
            commentableId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            commentableType: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['Post', 'Card']],
                },
            },
            authorName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            authorAvatar: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            postedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Comment',
            paranoid: true,
        },
    );

    return Comment;
};
