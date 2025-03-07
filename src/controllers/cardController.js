import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
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
        const card = await cardService.store(req.body);

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

        const deleted = await cardService.destroy(cardId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: deleted,
        });
    } catch (error) {
        next(error);
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

export default { get, getOneBySlug, getUpNext, store, update, destroy, updateCover };
