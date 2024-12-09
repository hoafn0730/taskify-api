import express from 'express';
import 'dotenv/config';
import exitHook from 'async-exit-hook';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

import APIs_V1 from './routes/v1';
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware';
import { corsOptions } from './config/cors';
import { closeDb, connection } from './config/connectDb';

const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT || 8017;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: corsOptions,
});

io.on('connection', (socket) => {
    console.log('A user connected');
    // socket.emit('hello', 'world');
    socket.broadcast.emit('hello', 'world1');

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
});

connection();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(
    express.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000,
    }),
);
app.use((req, res, next) => {
    res.io = io;
    next();
});
app.use('/api/v1', APIs_V1);
app.use('/', (req, res) => {
    res.send('Hello world!');
});
app.use(errorHandlingMiddleware);

httpServer.listen(port, async () => {
    // eslint-disable-next-line no-console
    console.log(`I am running at http://${hostname}:${port}`);
});

exitHook(() => {
    // eslint-disable-next-line no-console
    console.log('Exiting app');
    closeDb();
});
