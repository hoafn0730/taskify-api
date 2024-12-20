import { StatusCodes } from 'http-status-codes';
import { checklistService } from '~/services';

const getOneBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const checklists = await checklistService.getOneBySlug(slug);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: checklists,
        });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const checklist = await checklistService.store(req.body);

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: checklist,
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const checklistId = req.params.id;

        const updated = await checklistService.update(checklistId, req.body);

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
        const checklistId = req.params.id;

        const deleted = await checklistService.destroy(checklistId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: deleted,
        });
    } catch (error) {
        next(error);
    }
};

const storeCheckItem = async (req, res, next) => {
    try {
        const checklistId = req.params.id;

        const checkItem = await checklistService.storeCheckItem({ ...req.body, checklistId });

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: checkItem,
        });
    } catch (error) {
        next(error);
    }
};

const updateCheckItem = async (req, res, next) => {
    try {
        const checklistId = req.params.id;
        const checkItemId = req.params.checkItemId;

        const updated = await checklistService.updateCheckItem(checklistId, checkItemId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

const destroyCheckItem = async (req, res, next) => {
    try {
        const checklistId = req.params.id;
        const checkItemId = req.params.checkItemId;

        const deleted = await checklistService.destroyCheckItem(checklistId, checkItemId);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: deleted,
        });
    } catch (error) {
        next(error);
    }
};

export default { getOneBySlug, store, update, destroy, storeCheckItem, updateCheckItem, destroyCheckItem };
