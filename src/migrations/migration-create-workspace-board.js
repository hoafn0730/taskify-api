'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('workspace_boards', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            workspaceId: {
                type: Sequelize.INTEGER,
                allowNull: false, // Ràng buộc NOT NULL
            },
            boardId: {
                type: Sequelize.INTEGER,
                allowNull: false, // Ràng buộc NOT NULL
            },
            starred: {
                type: Sequelize.BOOLEAN,
                allowNull: false, // Ràng buộc NOT NULL
                defaultValue: false, // Giá trị mặc định
            },
            lastView: {
                type: Sequelize.DATE,
                allowNull: true, // Không bắt buộc
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

        // Tạo unique constraint cho workspaceId và boardId
        await queryInterface.addConstraint('workspace_boards', {
            fields: ['workspaceId', 'boardId'],
            type: 'unique',
            name: 'uq_workspace_boards_workspaceId_boardId', // Tên constraint
        });
    },
    async down(queryInterface) {
        // Xóa constraint trước khi xóa bảng
        await queryInterface.removeConstraint('workspace_boards', 'uq_workspace_boards_workspaceId_boardId');
        await queryInterface.dropTable('workspace_boards');
    },
};
