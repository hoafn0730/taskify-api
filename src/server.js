import 'dotenv/config';
import cors from 'cors';
import YAML from 'yamljs';
import morgan from 'morgan';
import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import exitHook from 'async-exit-hook';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import sockets from './sockets';
import APIs_V1 from './routes/v1';
import { corsOptions } from './config/cors';
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware';
import { close, connection } from './models';

const hostname = process.env.HOST || 'localhost';
const port = process.env.PORT || 8017;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: corsOptions });
const swaggerDocs = YAML.load('./swagger.yaml');

// Socket middleware để xác thực JWT
io.use(async (socket, next) => {
    try {
        //         const token = socket.handshake.auth.token;
        //
        //         if (!token) {
        //             return next(new Error('Authentication error'));
        //         }
        //
        //         const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //         const user = await User.findById(decoded.userId).select('-password');
        //
        //         if (!user) {
        //             return next(new Error('User not found'));
        //         }
        //
        //         socket.userId = user._id.toString();
        //         socket.user = user;
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
});
io.on('connection', sockets.connection);

connection();
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});
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
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/v1', APIs_V1);

app.get('/', (req, res) => {
    res.json('hello world');
});

app.use(errorHandlingMiddleware);

httpServer.listen(port, async () => {
    // eslint-disable-next-line no-console
    console.log(`I am running at http://${hostname}:${port}`);
});

exitHook(() => {
    // eslint-disable-next-line no-console
    console.log('Exiting app');
    close();
});
