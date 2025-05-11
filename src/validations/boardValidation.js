import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ApiError from '~/utils/ApiError';

const store = async (req, res, next) => {
    const correctCondition = Joi.object({
        title: Joi.string().required(),
        // .min(3).max(50).trim().strict(),
        description: Joi.string().required(),
        // .min(3).max(255).trim().strict(),
        type: Joi.string().valid('public', 'private').required(),
        image: Joi.string().optional(),
        members: Joi.array().items(Joi.number().integer()),
        tags: Joi.array().items(Joi.string().trim()),
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
        title: Joi.string().min(3).max(50).trim().strict(),
        description: Joi.string().min(3).max(255).trim().strict(),
        type: Joi.string().valid('public', 'private'),
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

const moveCardToDifferentColumn = async (req, res, next) => {
    const correctCondition = Joi.object({
        currentCardId: Joi.number().required().strict(),

        prevColumnId: Joi.number().required().strict(),
        prevCardOrderIds: Joi.array().required().items(Joi.string()).default([]),

        nextColumnId: Joi.number().required().strict(),
        nextCardOrderIds: Joi.array().required().items(Joi.string()).default([]),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

export default {
    store,
    update,
    destroy,
    moveCardToDifferentColumn,
};
