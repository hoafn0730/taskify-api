'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Posts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            slug: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            coverUrl: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            publish: {
                type: Sequelize.ENUM('draft', 'published', 'archived'),
                defaultValue: 'draft',
                allowNull: false,
            },
            metaTitle: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            metaDescription: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            metaKeywords: {
                type: Sequelize.JSON,
                defaultValue: [],
            },
            tags: {
                type: Sequelize.JSON,
                defaultValue: [],
            },
            totalViews: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            totalShares: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            totalComments: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            totalFavorites: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            authorId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });

        // Thêm indexes
        await queryInterface.addIndex('Posts', ['slug']);
        await queryInterface.addIndex('Posts', ['publish']);
        await queryInterface.addIndex('Posts', ['authorId']);
        await queryInterface.addIndex('Posts', ['createdAt']);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Posts');
    },
};
