import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import db from '~/models';
import { cardService } from '~/services';

const get = async (req, res, next) => {
    try {
        const page = req.query.page;
        const pageSize = req.query.pageSize || null;
        const cards = await cardService.get({ page, pageSize });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            meta: cards.meta,
            data: cards.data,
        });
    } catch (error) {
        next(error);
    }
};

const getOneBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const archivedAt = req.params.archivedAt;
        const cards = await cardService.getOneBySlug(slug, archivedAt);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: cards,
        });
    } catch (error) {
        next(error);
    }
};

const getUpNext = async (req, res, next) => {
    try {
        const cards = await cardService.get({
            where: { dueDate: { [Op.not]: null, [Op.gt]: new Date() }, dueComplete: false, archivedAt: null },
            order: [['dueDate', 'ASC']],
        });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: cards,
        });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const card = await cardService.store(req.body, userId);

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: card,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const cardId = req.params.id;

        const updated = await cardService.update(cardId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const cardId = req.params.id;

        const deleted = await cardService.destroy(cardId);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: deleted,
        });
    } catch (error) {
        next(error);
    }
};

const toggleAssignee = async (req, res, next) => {
    const { cardId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'Missing userId in request body',
        });
    }

    try {
        const card = await db.Card.findByPk(cardId);

        if (!card) {
            return res.status(StatusCodes.NOT_FOUND).json({
                statusCode: StatusCodes.NOT_FOUND,
                message: 'Card not found',
            });
        }

        const existing = await db.Member.findOne({
            where: {
                userId,
                objectId: cardId,
                objectType: 'card',
                role: 'member',
            },
        });

        if (existing) {
            await existing.destroy();

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                message: 'User unassigned from card',
                assigned: false,
            });
        }

        await db.Member.create({
            userId,
            objectId: cardId,
            objectType: 'card',
            role: 'member',
            active: true,
        });

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: 'User assigned to card',
            assigned: true,
        });
    } catch (error) {
        next(error); // Đẩy lỗi về middleware xử lý chung
    }
};

const updateCover = async (req, res, next) => {
    try {
        const cardId = req.params.id;
        const updated = await cardService.updateCover(cardId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

export default { get, getOneBySlug, store, update, destroy, toggleAssignee, updateCover, getUpNext };
