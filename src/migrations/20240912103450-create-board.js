'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Boards', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            workspaceId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.STRING,
            },
            type: {
                type: Sequelize.STRING,
            },
            slug: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.STRING,
            },
            shortLink: {
                type: Sequelize.STRING,
            },
            tags: {
                type: Sequelize.STRING,
            },
            columnOrderIds: {
                type: Sequelize.JSON,
                allowNull: false,
                defaultValue: [],
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
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Boards');
    },
};
