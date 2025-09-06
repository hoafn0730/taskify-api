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
