const Joi = require('joi');
const ApiError = require('../utils/ApiError');
const { StatusCodes } = require('http-status-codes');

const signIn = async (req, res, next) => {
    const correctCondition = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        password: Joi.string().min(6).max(50).required(),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

const signUp = async (req, res, next) => {
    const correctCondition = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        password: Joi.string().min(6).max(50).required(),
        displayName: Joi.string().min(3).max(50).required(),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

const verifyAccount = async (req, res, next) => {
    const correctCondition = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        // token: Joi.string().min(6).max(50).required(),
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

export const authValidation = {
    signIn,
    signUp,
    verifyAccount,
};
