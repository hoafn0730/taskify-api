import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ApiError from '~/utils/ApiError';

const store = async (req, res, next) => {
    const correctCondition = Joi.object({
        senderId: Joi.number().optional(),
        userId: Joi.number().required(),
        title: Joi.string().required().min(3).max(50).trim().strict(),
        type: Joi.string().required().min(3).max(50).trim().strict(),
        status: Joi.string().required().min(3).max(50).trim().strict(),
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
        senderId: Joi.number().optional(),
        userId: Joi.number().required(),
        title: Joi.string().required().min(3).max(50).trim().strict(),
        type: Joi.string().required().min(3).max(50).trim().strict(),
        status: Joi.string().required().min(3).max(50).trim().strict(),
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

export const categoryValidation = {
    store,
    update,
    destroy,
};
