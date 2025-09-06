'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },

            uid: {
                type: Sequelize.STRING,
                unique: true,
            },
            username: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            displayName: {
                type: Sequelize.STRING,
            },
            phoneNumber: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            avatar: {
                type: Sequelize.STRING,
            },
            type: {
                type: Sequelize.STRING,
            },
            role: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.STRING,
            },
            verified: {
                type: Sequelize.BOOLEAN,
            },
            verifiedAt: {
                type: Sequelize.DATE,
            },
            activityStatus: {
                type: Sequelize.STRING,
            },
            lastActivity: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            socketId: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable('Users');
    },
};
