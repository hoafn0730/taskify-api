import express from 'express';
import 'dotenv/config';
import exitHook from 'async-exit-hook';
import cors from 'cors';
import morgan from 'morgan';

import APIs_V1 from './routes/v1';
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware';
import { corsOptions } from './config/cors';
import { closeDb, connection } from './config/connectDb';

const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT || 8017;
const app = express();

connection();

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandlingMiddleware);
app.use('/api/v1', APIs_V1);

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`I am running at http://${hostname}:${port}`);
});

exitHook(() => {
    // eslint-disable-next-line no-console
    console.log('Exiting app');
    closeDb();
});
