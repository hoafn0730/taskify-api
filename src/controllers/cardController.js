import { StatusCodes } from 'http-status-codes';

import cardService from '~/services/cardService';

const getDetail = async (req, res, next) => {
    try {
        const cardId = req.params.id;
        const cards = await cardService.getDetail(cardId);

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

export default { getDetail, store, update, destroy };
