'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Cards', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            boardId: {
                type: Sequelize.INTEGER,
            },
            columnId: {
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.TEXT,
            },
            image: {
                type: Sequelize.STRING,
            },
            slug: {
                type: Sequelize.STRING,
                unique: true,
            },
            shortLink: {
                type: Sequelize.STRING,
            },
            uuid: {
                type: Sequelize.STRING,
            },
            dueStart: {
                type: Sequelize.DATE,
            },
            dueDate: {
                type: Sequelize.DATE,
            },
            dueComplete: {
                type: Sequelize.BOOLEAN,
            },
            dueReminder: {
                type: Sequelize.INTEGER,
            },
            archivedAt: {
                type: Sequelize.DATE,
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
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Cards');
    },
};
