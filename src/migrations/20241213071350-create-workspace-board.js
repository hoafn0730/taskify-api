'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('WorkspaceBoards', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            workspaceId: {
                type: Sequelize.INTEGER,
                allowNull: false, // Ràng buộc NOT NULL
                references: {
                    model: 'Workspaces', // Tên bảng liên kết
                    key: 'id', // Khóa chính trong bảng Workspaces
                },
                onDelete: 'CASCADE', // Xóa liên kết khi workspace bị xóa
                onUpdate: 'CASCADE', // Cập nhật liên kết khi workspace bị cập nhật
            },
            boardId: {
                type: Sequelize.INTEGER,
                allowNull: false, // Ràng buộc NOT NULL
                references: {
                    model: 'Boards', // Tên bảng liên kết
                    key: 'id', // Khóa chính trong bảng Boards
                },
                onDelete: 'CASCADE', // Xóa liên kết khi board bị xóa
                onUpdate: 'CASCADE', // Cập nhật liên kết khi board bị cập nhật
            },
            starred: {
                type: Sequelize.BOOLEAN,
                allowNull: false, // Ràng buộc NOT NULL
                defaultValue: false, // Giá trị mặc định
            },
            position: {
                type: Sequelize.INTEGER,
                allowNull: true, // Không bắt buộc
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
        await queryInterface.addConstraint('WorkspaceBoards', {
            fields: ['workspaceId', 'boardId'],
            type: 'unique',
            name: 'unique_workspace_board', // Tên constraint
        });
    },
    async down(queryInterface, Sequelize) {
        // Xóa constraint trước khi xóa bảng
        await queryInterface.removeConstraint('WorkspaceBoards', 'unique_workspace_board');
        await queryInterface.dropTable('WorkspaceBoards');
    },
};
