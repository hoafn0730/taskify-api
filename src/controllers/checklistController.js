import { StatusCodes } from 'http-status-codes';
import checklistService from '~/services/checklistService';

const getDetailBySlug = async (req, res, next) => {
    try {
        const slug = req.params.slug;
        const checklists = await checklistService.getDetailBySlug(slug);

        res.status(StatusCodes.OK).json({ data: checklists });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    try {
        const checklist = await checklistService.store(req.body);

        res.status(StatusCodes.CREATED).json(checklist);
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const checklistId = req.params.id;

        const updatedChecklist = await checklistService.update(checklistId, req.body);

        res.status(StatusCodes.OK).json(updatedChecklist);
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const checklistId = req.params.id;

        const updatedChecklist = await checklistService.destroy(checklistId, req.body);

        res.status(StatusCodes.OK).json(updatedChecklist);
    } catch (error) {
        next(error);
    }
};

const storeCheckItem = async (req, res, next) => {
    try {
        const checklistId = req.params.id;

        const updatedChecklist = await checklistService.storeCheckItem({ ...req.body, checklistId });

        res.status(StatusCodes.OK).json(updatedChecklist);
    } catch (error) {
        next(error);
    }
};

const updateCheckItem = async (req, res, next) => {
    try {
        const checklistId = req.params.id;
        const checkItemId = req.params.checkItemId;

        const updatedChecklist = await checklistService.updateCheckItem(checklistId, checkItemId, req.body);

        res.status(StatusCodes.OK).json(updatedChecklist);
    } catch (error) {
        next(error);
    }
};

const destroyCheckItem = async (req, res, next) => {
    try {
        const checklistId = req.params.id;
        const checkItemId = req.params.checkItemId;

        const updatedChecklist = await checklistService.destroyCheckItem(checklistId, checkItemId);

        res.status(StatusCodes.OK).json(updatedChecklist);
    } catch (error) {
        next(error);
    }
};

export default { getDetailBySlug, store, update, destroy, storeCheckItem, updateCheckItem, destroyCheckItem };
