import { StatusCodes } from 'http-status-codes';

import boardService from '~/services/boardService';

const getDetail = async (req, res, next) => {
    try {
        const boardId = req.params.id;
        const boards = await boardService.getDetail(boardId);

        res.status(StatusCodes.OK).json({ data: boards });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const boards = await boardService.store(req.body);
        res.status(StatusCodes.CREATED).json(boards);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const boardId = req.params.id;

        const updatedBoard = await boardService.update(boardId, req.body);

        res.status(StatusCodes.OK).json(updatedBoard);
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const boardId = req.params.id;

        const updatedBoard = await boardService.destroy(boardId, req.body);

        res.status(StatusCodes.OK).json(updatedBoard);
    } catch (error) {
        next(error);
    }
};

export default { getDetail, store, update, destroy };
