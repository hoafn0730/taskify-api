import express from 'express';
import { StatusCodes } from 'http-status-codes';

import boardRouter from './boardRouter';
import columnRouter from './columnRouter';
import cardRouter from './cardRouter';
import userRouter from './userRouter';
import checklistRouter from './checklistRouter';
import attachmentRouter from './attachmentRouter';
import memberRouter from './memberRouter';
import { authMiddleware } from '~/middlewares/authMiddleware';

const router = express.Router();

router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Hello world!' });
});

// router.all('*', authMiddleware);

router.use('/boards', boardRouter);
router.use('/columns', columnRouter);
router.use('/cards', cardRouter);
router.use('/users', userRouter);
router.use('/checklists', checklistRouter);
router.use('/attachments', attachmentRouter);
router.use('/members', memberRouter);

export default router;
