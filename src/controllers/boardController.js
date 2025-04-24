import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';
import { boardService, memberService, workspaceService } from '~/services';
import db from '~/models';

const get = async (req, res, next) => {
    try {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const boards = await boardService.get({ page, pageSize });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            meta: boards.meta,
            data: boards.data,
        });
    } catch (error) {
        next(error);
    }
};

const search = async (req, res, next) => {
    try {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const query = req.query.q;
        const boards = await boardService.get({
            page,
            pageSize,
            where: {
                title: {
                    [Op.like]: query + '%',
                },
            },
        });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            meta: boards.meta,
            data: boards.data,
        });
    } catch (error) {
        next(error);
    }
};

const getBoardBySlug = async (req, res, next) => {
    // const userId = req.user.id;

    try {
        const slug = req.params.slug;
        const board = await boardService.getBoardBySlug(slug);

        // const workspace = await workspaceService.getOne({ where: { userId: userId }, raw: true });

        // await db.WorkspaceBoard.upsert(
        //     {
        //         boardId: board.id,
        //         workspaceId: workspace.id,
        //         lastView: new Date(),
        //     },
        //     { workspaceId: workspace.id },
        // );

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: board,
        });
    } catch (error) {
        next(error);
    }
};

const getCombinedBoards = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const workspace = await workspaceService.getOne({
            where: { userId },
            include: [
                {
                    model: db.Board,
                    as: 'boards',
                    through: {
                        as: 'workspaceBoard',
                        attributes: ['lastView'],
                        where: { lastView: { [Op.not]: null } },
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
        const board = await boardService.store(req.body);

        await memberService.store({
            userId: req.user.id,
            objectId: board.id,
            objectType: 'board',
            role: 'owner',
            active: true,
        });

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: board,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const boardId = req.params.id;
        const updated = await boardService.update(boardId, req.body);

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
        const boardId = req.params.id;
        const deleted = await boardService.destroy(boardId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: deleted,
        });
    } catch (error) {
        next(error);
    }
};

const moveCardToDifferentColumn = async (req, res, next) => {
    try {
        const result = await boardService.moveCardToDifferentColumn(req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const generate = async (req, res, next) => {
    try {
        const board = await boardService.generate(req.body.content);

        if (!board?.message) {
            await memberService.store({
                userId: req.user.id,
                objectId: board.id,
                objectType: 'board',
                role: 'owner',
                active: true,
            });
        }

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: board,
        });
    } catch (error) {
        next(error);
    }
};

const updateBackground = async (req, res, next) => {
    try {
        const boardId = req.params.id;
        const updated = await boardService.updateBackground(boardId, req.body.file);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

export default {
    get,
    search,
    getBoardBySlug,
    store,
    update,
    destroy,
    moveCardToDifferentColumn,
    generate,
    updateBackground,
    getCombinedBoards,
};
