'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

            Invoice.hasOne(models.Transaction, {
                foreignKey: 'invoiceId',
                as: 'transaction',
            });
        }
    }
    Invoice.init(
        {
            code: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('unpaid', 'paid', 'overdue'),
                defaultValue: 'unpaid',
            },
            dueDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            paidAt: DataTypes.DATE,
            userId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Invoice',
        },
    );
    return Invoice;
};
