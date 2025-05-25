'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Comments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            commentableId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            commentableType: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    isIn: [['Post', 'Card']], // Chỉ cho phép Post hoặc Card
                },
            },
            authorName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            authorAvatar: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            message: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            postedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
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

        // Tạo composite index cho polymorphic relationship
        await queryInterface.addIndex('Comments', ['commentableId', 'commentableType'], {
            name: 'comments_commentable_index',
        });

        // Index cho performance
        await queryInterface.addIndex('Comments', ['commentableType']);
        await queryInterface.addIndex('Comments', ['postedAt']);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Comments');
    },
};
