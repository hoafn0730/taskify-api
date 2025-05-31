'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Team extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsToMany(models.User, {
                through: {
                    model: models.Member,
                    scope: { objectType: 'team' },
                },
                foreignKey: 'objectId',
                otherKey: 'userId',
                constraints: false,
                as: 'members',
            });
        }
    }
    Team.init(
        {
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            image: DataTypes.STRING,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Team',
        },
    );
    return Team;
};
