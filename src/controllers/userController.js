import { StatusCodes } from 'http-status-codes';
import userService from '~/services/userService';

const getOne = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const users = await userService.getOne(userId);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const users = await userService.store(req.body);

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const updatedUser = await userService.update(userId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const updatedUser = await userService.destroy(userId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

export default { getOne, store, update, destroy };
