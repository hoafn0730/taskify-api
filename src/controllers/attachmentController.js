import { StatusCodes } from 'http-status-codes';
import attachmentService from '~/services/attachmentService';

const getOne = async (req, res, next) => {
    try {
        const attachmentId = req.params.id;
        const attachments = await attachmentService.getOne(attachmentId);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: attachments,
        });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const attachment = await attachmentService.store(req.body);

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: attachment,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const attachmentId = req.params.id;

        const updatedAttachment = await attachmentService.update(attachmentId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updatedAttachment,
        });
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const attachmentId = req.params.id;

        const updatedAttachment = await attachmentService.destroy(attachmentId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updatedAttachment,
        });
    } catch (error) {
        next(error);
    }
};

export default { getOne, store, update, destroy };
