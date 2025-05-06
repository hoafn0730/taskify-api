import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ApiError from '~/utils/ApiError';

const save = async (req, res, next) => {
    const correctCondition = Joi.object({
        id: Joi.number().optional(),
        to: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .optional(),
        from: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        folder: Joi.string().required().min(3).max(50).trim().strict(),
        subject: Joi.string().required().min(3).max(100).trim().strict(),
        message: Joi.string().required().trim().strict(),
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
        title: Joi.string().min(3).max(50).trim().strict(),
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

export const mailValidation = {
    save,
    update,
    destroy,
};
