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
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: true,
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
