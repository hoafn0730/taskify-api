'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Invoices', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            code: {
                type: Sequelize.STRING,
            },
            amount: {
                type: Sequelize.FLOAT,
            },
            status: {
                type: Sequelize.STRING,
            },
            dueDate: {
                type: Sequelize.DATE,
            },
            paidAt: {
                type: Sequelize.DATE,
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
        await queryInterface.dropTable('Invoices');
    },
};
