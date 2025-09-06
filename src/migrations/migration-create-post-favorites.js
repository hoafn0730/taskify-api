'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('PostFavorites', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            postId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Posts',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            userName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            userAvatar: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });

        // Tạo unique constraint để tránh duplicate favorites
        await queryInterface.addIndex('PostFavorites', ['postId', 'userId'], {
            unique: true,
            name: 'unique_post_user_favorite',
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('PostFavorites');
    },
};
