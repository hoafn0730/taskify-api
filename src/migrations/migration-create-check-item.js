'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('CheckItems', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            cardId: {
                type: Sequelize.INTEGER,
            },
            checklistId: {
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: 'incomplete',
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
        await queryInterface.dropTable('CheckItems');
    },
};
