import { StatusCodes } from 'http-status-codes';
import attachmentService from '~/services/attachmentService';

const getDetail = async (req, res, next) => {
    try {
        const attachmentId = req.params.id;
        const attachments = await attachmentService.getDetail(attachmentId);

        res.status(StatusCodes.OK).json({ data: attachments });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const attachment = await attachmentService.store(req.body);

        res.status(StatusCodes.CREATED).json(attachment);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const attachmentId = req.params.id;

        const updatedAttachment = await attachmentService.update(attachmentId, req.body);

        res.status(StatusCodes.OK).json(updatedAttachment);
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const attachmentId = req.params.id;

        const updatedAttachment = await attachmentService.destroy(attachmentId, req.body);

        res.status(StatusCodes.OK).json(updatedAttachment);
    } catch (error) {
        next(error);
    }
};

export default { getDetail, store, update, destroy };
