import { StatusCodes } from 'http-status-codes';
import { commentService } from '~/services';

const get = async (req, res, next) => {
    try {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const comments = await commentService.get({ page, pageSize });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            meta: comments.meta,
            data: comments.data,
        });
    } catch (error) {
        next(error);
    }
};

const getOne = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const comment = await commentService.getOne(commentId);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: comment,
        });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const comment = await commentService.store({ ...req.body, userId: req.user.id });
        comment.data.dataValues.user = req.user;

        res.io.emit('receiveComment', {
            comment: comment,
        });

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: comment,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const commentId = req.params.id;

        const updatedComment = await commentService.update(commentId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updatedComment,
        });
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const commentId = req.params.id;

        const updatedComment = await commentService.destroy({ id: commentId });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updatedComment,
        });
    } catch (error) {
        next(error);
    }
};

export default { get, getOne, store, update, destroy };
