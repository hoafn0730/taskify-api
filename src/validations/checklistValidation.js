import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ApiError from '~/utils/ApiError';

const store = async (req, res, next) => {
    const correctCondition = Joi.object({
        boardId: Joi.number().required(),
        cardId: Joi.number().required(),
        title: Joi.string().required().min(3).max(50).trim().strict(),
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
        description: Joi.string().min(3).trim().strict(),
        image: Joi.string().min(3).max(255).trim().strict(),
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

const storeCheckItem = async (req, res, next) => {
    const correctCondition = Joi.object({
        title: Joi.string().min(3).max(50).trim().strict(),
        status: Joi.string().min(3).max(255).trim().strict(),
    });
    const correctParamsCondition = Joi.object({
        id: Joi.number().required(),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        await correctParamsCondition.validateAsync(req.params, { abortEarly: false });

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

const updateCheckItem = async (req, res, next) => {
    const correctCondition = Joi.object({
        title: Joi.string().min(3).max(50).trim().strict(),
        status: Joi.string().min(3).max(255).trim().strict(),
    });
    const correctParamsCondition = Joi.object({
        id: Joi.number().required(),
        checkItemId: Joi.number().required(),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true });
        await correctParamsCondition.validateAsync(req.params, { abortEarly: false });

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

const destroyCheckItem = async (req, res, next) => {
    const correctCondition = Joi.object({
        id: Joi.number().required(),
        checkItemId: Joi.number().required(),
    });

    try {
        await correctCondition.validateAsync(req.params);

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

export default {
    store,
    update,
    destroy,
    storeCheckItem,
    updateCheckItem,
    destroyCheckItem,
};
