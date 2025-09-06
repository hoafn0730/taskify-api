'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Messages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },

            content: {
                type: Sequelize.TEXT,
            },
            contentType: {
                type: Sequelize.STRING,
            },
            senderId: {
                type: Sequelize.STRING,
            },
            conversationId: {
                type: Sequelize.STRING,
            },
            replyTo: Sequelize.INTEGER,
            metadata: {
                type: Sequelize.JSON,
                defaultValue: {},
            },
            isEdited: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            editedAt: {
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Messages');
    },
};
