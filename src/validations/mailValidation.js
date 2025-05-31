import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ApiError from '~/utils/ApiError';

const save = async (req, res, next) => {
    const correctCondition = Joi.object({
        id: Joi.number().optional().allow(null),
        to: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .optional()
            .allow(''),
        from: Joi.number().required(),
        folder: Joi.string().optional().min(3).max(50).trim().allow(''),
        subject: Joi.string().optional().min(3).max(100).trim().allow(''),
        message: Joi.string().optional().trim().allow(''),
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
