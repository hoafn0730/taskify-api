import { StatusCodes } from 'http-status-codes';
import { userService } from '~/services';
import ApiError from '~/utils/ApiError';

const get = async (req, res, next) => {
    try {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const query = req.query.q;
        const users = await userService.get({ page, pageSize, query });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            meta: users.meta,
            data: users.data,
        });
    } catch (error) {
        next(error);
    }
};

const getOnline = async (req, res, next) => {
    try {
        const page = req.query.page;
        const pageSize = req.query.pageSize;

        const users = await userService.get({
            page,
            pageSize,
            where: { activityStatus: 'online' },
            all: true,
            attributes: ['id', 'username', 'displayName', 'avatar', 'activityStatus'],
        });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

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
        const user = await userService.store(req.body);

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const updated = await userService.update(userId, req.body);

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
        const userId = req.params.id;

        if (req.user.id === +userId) {
            return next(new ApiError(StatusCodes.CONFLICT), StatusCodes[StatusCodes.CONFLICT]);
        }

        const deleted = await userService.destroy(userId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: deleted,
        });
    } catch (error) {
        next(error);
    }
};

export default { get, getOnline, getOne, store, update, destroy };
