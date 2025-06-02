import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ApiError from '~/utils/ApiError';

const store = async (req, res, next) => {
    const correctCondition = Joi.object({
        boardId: Joi.number().required(),
        columnId: Joi.number().required(),
        title: Joi.string().required().min(3).max(50).trim().strict(),
        priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
        dueStart: Joi.date().optional(),
        dueDate: Joi.date().optional(),
        description: Joi.string().optional().allow(''),
        labels: Joi.string().default('[]'),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

const update = async (req, res, next) => {
    const correctCondition = Joi.object({
        boardId: Joi.number(),
        columnId: Joi.number(),
        title: Joi.string().min(3).max(50).trim().strict(),
        description: Joi.string().min(3).trim().optional().allow(''),
        dueDate: Joi.date().allow(null),
        dueComplete: Joi.boolean().strict(),
        dueReminder: Joi.number().strict(),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true });

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

const destroy = async (req, res, next) => {
    const correctCondition = Joi.object({
        id: Joi.number().required(),
    });

    try {
        await correctCondition.validateAsync(req.params);

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

export const cardValidation = {
    store,
    update,
    destroy,
};
