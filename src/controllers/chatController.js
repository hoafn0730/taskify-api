import { StatusCodes } from 'http-status-codes';
import db from '~/models';
import { conversationService, messageService } from '~/services';

const get = async (req, res, next) => {
    try {
        const conversationsRaw = await conversationService.get({
            all: true,
            include: [
                {
                    model: db.Participant,
                    as: 'participants',
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id', 'username', 'displayName', 'avatar', 'activityStatus'],
                        },
                    ],
                    where: { userId: req?.user?.id || 26 },
                },
                {
                    model: db.Message,
                    as: 'messages',
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    include: [
                        {
                            model: db.User,
                            as: 'sender',
                            attributes: ['id', 'username', 'displayName'],
                        },
                    ],
                },
            ],
            order: [['lastMessageAt', 'DESC']],
        });

        // Flatten user fields vào participants
        const conversations = conversationsRaw.map((conversation) => {
            const flattenedConversation = conversation.toJSON();

            if (flattenedConversation.participants) {
                flattenedConversation.participants = flattenedConversation.participants.map((participant) => {
                    // Merge user fields vào participant level
                    const { user, ...participantData } = participant;

                    return {
                        ...participantData,
                        // User fields với prefix để tránh conflict
                        username: user?.username,
                        displayName: user?.displayName,
                        avatar: user?.avatar,
                        activityStatus: user?.activityStatus,
                        // Hoặc không prefix nếu muốn
                        // ...user
                    };
                });
            }

            return flattenedConversation;
        });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: conversations,
        });
    } catch (error) {
        next(error);
    }
};

const getOne = async (req, res, next) => {
    try {
        const conversationId = req.params.id;
        const conversation = await conversationService.getOne({
            where: { id: conversationId },
            include: {
                model: db.Message,
                as: 'messages',
                limit: 1,
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: db.User,
                        as: 'sender',
                        attributes: ['id', 'username', 'displayName', 'avatar'],
                    },
                ],
            },
        });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: conversation,
        });
    } catch (error) {
        next(error);
    }
};

const getMessages = async (req, res, next) => {
    try {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const conversationId = req.params.id;

        // Check if user is participant
        const participant = await db.Participant.findOne({
            where: {
                conversationId: conversationId,
                userId: req?.user?.id || 26,
            },
        });

        if (!participant) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const messages = await messageService.get({
            where: { conversationId },
            page,
            pageSize,
            include: [
                {
                    model: db.User,
                    as: 'sender',
                    attributes: ['id', 'username', 'displayName', 'avatar'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: messages.data.reverse(),
        });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const { participantIds, title, type = 'private' } = req.body;

        // Create conversation
        const conversation = await conversationService.store({
            title,
            type,
            createdBy: req?.user?.id || 26,
            lastMessageAt: new Date(),
        });

        // Add participants
        const participants = [req?.user?.id || 26, ...participantIds];
        await Promise.all(
            participants.map((userId) =>
                db.Participant.create({
                    conversationId: conversation.id,
                    userId,
                    role: userId === (req?.user?.id || 26) ? 'admin' : 'member',
                }),
            ),
        );

        // Return conversation with participants
        const newConversation = await conversationService.getOne({
            where: { id: conversation.id },
            include: [
                {
                    model: db.Participant,
                    as: 'participants',
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: ['id', 'username', 'displayName', 'avatar'],
                        },
                    ],
                },
            ],
        });

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: newConversation,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const attachmentId = req.params.id;

        // const updated = await attachmentService.update(attachmentId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            // data: updated,
        });
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const attachmentId = req.params.id;

        // const deleted = await attachmentService.destroy(attachmentId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            // data: deleted,
        });
    } catch (error) {
        next(error);
    }
};

export default { get, getOne, getMessages, store, update, destroy };
