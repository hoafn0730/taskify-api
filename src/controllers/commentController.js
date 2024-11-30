import { StatusCodes } from 'http-status-codes';
import commentService from '~/services/commentService';

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
        const comment = await commentService.store(req.body);

        res.io.emit('notification', {
            message: 'hello',
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

        const updatedComment = await commentService.destroy(commentId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updatedComment,
        });
    } catch (error) {
        next(error);
    }
};

export default { getOne, store, update, destroy };
