'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Transactions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            gateway: {
                type: Sequelize.STRING,
            },
            transactionDate: {
                type: Sequelize.DATE,
            },
            accountNumber: {
                type: Sequelize.STRING,
            },
            subAccount: {
                type: Sequelize.STRING,
            },
            amountIn: {
                type: Sequelize.INTEGER,
            },
            amountOut: {
                type: Sequelize.INTEGER,
            },
            accumulated: {
                type: Sequelize.INTEGER,
            },
            code: {
                type: Sequelize.STRING,
            },
            transactionContent: {
                type: Sequelize.TEXT,
            },
            referenceNumber: {
                type: Sequelize.STRING,
            },
            body: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable('Transactions');
    },
};
