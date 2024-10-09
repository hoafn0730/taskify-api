import { StatusCodes } from 'http-status-codes';

import boardService from '~/services/boardService';

const get = async (req, res, next) => {
    try {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const query = req.query.q;
        const boards = await boardService.get({ page, pageSize, query });

        res.status(StatusCodes.OK).json({ data: boards });
    } catch (error) {
        next(error);
    }
};

const getDetail = async (req, res, next) => {
    try {
        const boardId = req.params.id;
        const boards = await boardService.getDetail(boardId);

        res.status(StatusCodes.OK).json({ data: boards });
    } catch (error) {
        next(error);
    }
};

const getBoardBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const boards = await boardService.getBoardBySlug(slug);

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

const moveCardToDifferentColumn = async (req, res, next) => {
    try {
        const result = await boardService.moveCardToDifferentColumn(req.body);

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
};
export default { get, getDetail, getBoardBySlug, store, update, destroy, moveCardToDifferentColumn };
