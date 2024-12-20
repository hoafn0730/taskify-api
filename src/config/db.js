import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.json')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

export const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export const close = async () => {
    sequelize.close();
};

export default { connection, close };
