'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Transaction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Transaction.init(
        {
            userId: DataTypes.INTEGER,
            gateway: DataTypes.STRING,
            transactionDate: DataTypes.DATE,
            accountNumber: DataTypes.STRING,
            subAccount: DataTypes.STRING,
            amountIn: DataTypes.INTEGER,
            amountOut: DataTypes.INTEGER,
            accumulated: DataTypes.INTEGER,
            code: DataTypes.STRING,
            transactionContent: DataTypes.TEXT,
            referenceNumber: DataTypes.STRING,
            body: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'Transaction',
        },
    );
    return Transaction;
};
