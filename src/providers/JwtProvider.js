import jwt from 'jsonwebtoken';

const createToken = (payload) => {
    let key = process.env.JWT_SECRET;

    return jwt.sign(payload, key, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const verifyToken = (token) => {
    const key = process.env.JWT_SECRET;

    return jwt.verify(token, key);
};

const extractToken = (authorization) => {
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        return authorization.split(' ')[1];
    }

    return null;
};

export const JwtProvider = {
    createToken,
    verifyToken,
    extractToken,
};
