'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Mails', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            to: {
                type: Sequelize.STRING,
            },
            from: {
                type: Sequelize.STRING,
            },
            folder: {
                type: Sequelize.STRING,
            },
            subject: {
                type: Sequelize.STRING,
            },
            message: {
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
        await queryInterface.dropTable('Mails');
    },
};
