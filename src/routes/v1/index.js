import express from 'express';
import { StatusCodes } from 'http-status-codes';

import boardRouter from './boardRouter';
import columnRouter from './columnRouter';
import cardRouter from './cardRouter';

const router = express.Router();

router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Hello world!' });
});

router.use('/boards', boardRouter);
router.use('/columns', columnRouter);
router.use('/cards', cardRouter);

export default router;
