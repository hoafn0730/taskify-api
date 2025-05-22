import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ApiError from '~/utils/ApiError';

const baseValidation = {
    title: Joi.string().required().min(3).max(255).trim(),
    allDay: Joi.boolean().required(),
    color: Joi.string().optional().max(20).trim(),
    description: Joi.string().optional().allow('').max(1000).trim(),
    start: Joi.date().required(),
    end: Joi.date().required().greater(Joi.ref('start')).messages({
        'date.greater': '"end" phải sau "start"',
    }),
};

const store = async (req, res, next) => {
    const schema = Joi.object(baseValidation);

    try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
};

const update = async (req, res, next) => {
    const schema = Joi.object(baseValidation);

    try {
        await schema.validateAsync(req.body, { abortEarly: false, allowUnknown: true });
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
};

const destroy = async (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().required(),
    });

    try {
        await schema.validateAsync(req.params);
        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
    }
};

export const calendarValidation = {
    store,
    update,
    destroy,
};
