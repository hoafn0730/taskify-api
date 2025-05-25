import { StatusCodes } from 'http-status-codes';
import { postService } from '~/services';

const get = async (req, res, next) => {
    try {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const posts = await postService.get({ page, pageSize });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: posts,
        });
    } catch (error) {
        next(error);
    }
};

const getOne = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const post = await postService.getOne({ where: { slug } });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const post = await postService.store(req.body);

        res.io.emit('notification', {
            message: 'hello',
        });

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const postId = req.params.id;

        const updated = await postService.update(postId, req.body);

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
        const postId = req.params.id;

        const deleted = await postService.destroy(postId);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: deleted,
        });
    } catch (error) {
        next(error);
    }
};

export default { get, getOne, store, update, destroy };
