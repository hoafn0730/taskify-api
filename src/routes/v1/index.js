import express from 'express';
import { StatusCodes } from 'http-status-codes';

import authMiddleware from '~/middlewares/authMiddleware';
import { boardService, cardService } from '~/services';
import ApiError from '~/utils/ApiError';

import boardRouter from './boardRouter';
import columnRouter from './columnRouter';
import cardRouter from './cardRouter';
import userRouter from './userRouter';
import checklistRouter from './checklistRouter';
import attachmentRouter from './attachmentRouter';
import memberRouter from './memberRouter';
import commentRouter from './commentRouter';
import notificationRouter from './notificationRouter';
import workspaceRouter from './workspaceRouter';
import transactionRouter from './transactionRouter';
import categoryRouter from './categoryRouter';
import authRouter from './authRouter';
import mailRouter from './mailRouter';
import chatRouter from './chatRouter';

const router = express.Router();

router.get('/status', async (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Hello world!' });
});

// Endpoint nhận Webhook
router.post('/webhook/seapay', (req, res) => {
    // Xử lý dữ liệu
    const data = req.body;
    console.log('Webhook received:', data);

    if (data) {
        res.io.emit('transaction-update', data);
    }

    // Phản hồi lại Seapay
    res.status(200).json({ success: true, data });
});

router.use('/auth', authRouter);

// router.all('*', authMiddleware.isAuthorized);

router.use('/boards', boardRouter);
router.use('/columns', columnRouter);
router.use('/cards', cardRouter);
router.use('/checklists', checklistRouter);
router.use('/attachments', attachmentRouter);
router.use('/members', memberRouter);
router.use('/comments', commentRouter);
router.use('/notifications', notificationRouter);
router.use('/users', userRouter);
router.use('/workspaces', workspaceRouter);
router.use('/transactions', transactionRouter);
router.use('/categories', categoryRouter);
router.use('/mails', mailRouter);
router.use('/chat', chatRouter);

router.get('/get-by-short-link', async (req, res, next) => {
    const shortLink = req.query.shortLink;
    const type = req.query.type;

    let data;
    if (type === 'board') {
        data = await boardService.getOne({ where: { shortLink } });
    } else if (type === 'card') {
        data = await cardService.getOne({ where: { shortLink } });
    } else {
        return next(ApiError(StatusCodes.NOT_FOUND, 'NOT_FOUND'));
    }

    res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: StatusCodes[StatusCodes.OK],
        data: data,
    });
});

export default router;
