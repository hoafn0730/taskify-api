import { StatusCodes } from 'http-status-codes';
import db from '~/models';
import { conversationService, messageService } from '~/services';

const get = async (req, res, next) => {
    try {
        const userId = req.user.id || 26;

        // ✅ Bước 1: Lấy conversations mà user tham gia (không include participants)
        const conversationsRaw = await conversationService.get({
            all: true,
            where: {
                '$participants.userId$': userId,
            },
            include: [
                {
                    // Chỉ include để filter, không lấy data
                    model: db.Participant,
                    as: 'participants',
                    where: { userId },
                    required: true,
                    attributes: [], // Không lấy data participants ở đây
                },
                {
                    model: db.Message,
                    as: 'messages',
                    limit: 1,
                    separate: true,
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

        // Extract conversation IDs
        const conversationIds = conversationsRaw.map((conv) => conv.id);

        if (conversationIds.length === 0) {
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                message: StatusCodes[StatusCodes.OK],
                data: [],
            });
        }

        // ✅ Bước 2: Lấy TẤT CẢ participants cho các conversations đó
        const allParticipants = await db.Participant.findAll({
            where: {
                conversationId: {
                    [db.Sequelize.Op.in]: conversationIds,
                },
            },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: [
                        'id',
                        'username',
                        'displayName',
                        'email',
                        'phoneNumber',
                        'address',
                        'avatar',
                        'activityStatus',
                    ],
                },
            ],
        });

        // ✅ Bước 3: Group participants theo conversationId
        const participantsByConversation = {};
        allParticipants.forEach((participant) => {
            const convId = participant.conversationId;
            if (!participantsByConversation[convId]) {
                participantsByConversation[convId] = [];
            }
            participantsByConversation[convId].push(participant);
        });

        // ✅ Bước 4: Merge participants vào conversations và flatten
        const conversations = conversationsRaw.map((conversation) => {
            const flattenedConversation = conversation.toJSON();

            // Thay thế participants cũ bằng participants đầy đủ
            const conversationParticipants = participantsByConversation[conversation.id] || [];

            flattenedConversation.participants = conversationParticipants.map((participant) => {
                const { user, ...participantData } = participant.toJSON();

                return {
                    ...participantData,
                    userId: user?.id,
                    ...user,
                };
            });

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
        const conversationRaw = await conversationService.getOne({
            where: { id: conversationId },
            include: [
                {
                    model: db.Participant,
                    as: 'participants',
                    include: [
                        {
                            model: db.User,
                            as: 'user',
                            attributes: [
                                'id',
                                'username',
                                'displayName',
                                'email',
                                'phoneNumber',
                                'address',
                                'avatar',
                                'activityStatus',
                            ],
                        },
                    ],
                },
                {
                    model: db.Message,
                    as: 'messages',
                    separate: true, // 👈 Đảm bảo sắp xếp riêng
                    order: [['createdAt', 'ASC']],
                    include: [
                        {
                            model: db.User,
                            as: 'sender',
                            attributes: ['id', 'username', 'displayName', 'avatar'],
                        },
                    ],
                },
            ],
        });

        // Flatten user fields vào participants
        const flattenedConversation = conversationRaw.toJSON();

        if (flattenedConversation.participants) {
            flattenedConversation.participants = flattenedConversation.participants.map((participant) => {
                // Merge user fields vào participant level
                const { user, ...participantData } = participant;

                return {
                    ...participantData,
                    userId: +participantData.userId,
                    conversationId: +participantData.conversationId,

                    // Hoặc không prefix nếu muốn
                    ...user,
                };
            });
        }

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: flattenedConversation,
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
        const { participants: participantIds, title, type = 'private', messages } = req.body;

        // Create conversation
        const conversation = await conversationService.store({
            title,
            type,
            createdBy: req?.user?.id || 26,
            lastMessageAt: new Date(),
        });

        // Add participants
        const participants = [...new Set([req?.user?.id || 26, ...participantIds])];
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

        await Promise.all(
            messages.map((message) =>
                db.Message.create({
                    senderId: req?.user?.id,
                    conversationId: conversation.id,
                    content: message.content,
                    contentType: message.contentType,
                }),
            ),
        );

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
