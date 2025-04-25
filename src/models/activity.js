'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Activity extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }
    Activity.init(
        {
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            userId: DataTypes.INTEGER,
            target: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Activity',
        },
    );
    return Activity;
};
