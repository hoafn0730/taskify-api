'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class WorkspaceBoard extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Workspace, { foreignKey: 'workspaceId' });
            this.belongsTo(models.Board, { foreignKey: 'boardId' });
        }
    }
    WorkspaceBoard.init(
        {
            workspaceId: DataTypes.INTEGER,
            boardId: DataTypes.INTEGER,
            starred: { type: DataTypes.BOOLEAN, defaultValue: false },
            lastView: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'WorkspaceBoard',
        },
    );
    return WorkspaceBoard;
};
