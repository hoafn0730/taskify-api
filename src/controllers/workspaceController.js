import { StatusCodes } from 'http-status-codes';
import db from '~/models';
import { workspaceService } from '~/services';

const get = async (req, res, next) => {
    try {
        const workspace = await workspaceService.getOne({
            where: { userId: req?.user?.id || '14' },
            include: [
                {
                    model: db.Board,
                    as: 'boards',
                    through: {
                        attributes: [],
                    },
                },
                {
                    model: db.Board,
                    as: 'boardStars',
                    through: { attributes: [], where: { isStarred: true } },
                },
            ],
        });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: workspace,
        });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const workspace = await workspaceService.store({ ...req.body, userId: req.user.id });

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: workspace,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const workspaceId = req.params.id;
        const updated = await workspaceService.update(workspaceId, req.body);

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
        const workspaceId = req.params.id;
        const deleted = await workspaceService.destroy(workspaceId);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: deleted,
        });
    } catch (error) {
        next(error);
    }
};

export default { get, store, update, destroy };
