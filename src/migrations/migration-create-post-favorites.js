'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('post_favorites', {
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
        await queryInterface.addIndex('post_favorites', ['postId', 'userId'], {
            unique: true,
            name: 'uq_post_favorites_postId_userId',
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable('post_favorites');
    },
};
