import { StatusCodes } from 'http-status-codes';

import columnService from '~/services/columnService';

const getDetail = async (req, res, next) => {
    try {
        const columnId = req.params.id;
        const columns = await columnService.getDetail(columnId);

        res.status(StatusCodes.OK).json({ data: columns });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const column = await columnService.store(req.body);

        res.status(StatusCodes.CREATED).json(column);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const columnId = req.params.id;

        const updatedColumn = await columnService.update(columnId, req.body);

        res.status(StatusCodes.OK).json(updatedColumn);
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const columnId = req.params.id;

        const updatedColumn = await columnService.destroy(columnId, req.body);

        res.status(StatusCodes.OK).json(updatedColumn);
    } catch (error) {
        next(error);
    }
};

const moveColumn = async (req, res, next) => {
    try {
        const resData = await columnService.moveColumn(req.body);

        res.status(StatusCodes.OK).json(resData);
    } catch (error) {
        next(error);
    }
};

export default { getDetail, store, update, destroy, moveColumn };
