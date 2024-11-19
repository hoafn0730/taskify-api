import { StatusCodes } from 'http-status-codes';

import cardService from '~/services/cardService';

const get = async (req, res, next) => {
    try {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const query = req.query.q;
        const cards = await cardService.get({ page, pageSize, query });

        res.status(StatusCodes.OK).json({ data: cards });
    } catch (error) {
        next(error);
    }
};

const getDetailBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const archivedAt = req.params.archivedAt;
        const cards = await cardService.getDetailBySlug(slug, archivedAt);

        res.status(StatusCodes.OK).json({ data: cards });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const card = await cardService.store(req.body);

        res.status(StatusCodes.CREATED).json(card);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const cardId = req.params.id;

        const updatedCard = await cardService.update(cardId, req.body);

        res.status(StatusCodes.OK).json(updatedCard);
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const cardId = req.params.id;

        const updatedCard = await cardService.destroy(cardId, req.body);

        res.status(StatusCodes.OK).json(updatedCard);
    } catch (error) {
        next(error);
    }
};

export default { get, getDetailBySlug, store, update, destroy };
