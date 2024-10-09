import { StatusCodes } from 'http-status-codes';

import userService from '~/services/userService';

const getDetail = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const users = await userService.getDetail(userId);

        res.status(StatusCodes.OK).json({ data: users, user: req.user });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const users = await userService.store(req.body);
        res.status(StatusCodes.CREATED).json(users);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const updatedUser = await userService.update(userId, req.body);

        res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const updatedUser = await userService.destroy(userId, req.body);

        res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

export default { getDetail, store, update, destroy };
