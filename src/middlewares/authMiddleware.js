const { StatusCodes } = require('http-status-codes');
const jwtService = require('~/services/jwtService');
const ApiError = require('../utils/ApiError');
const { default: axios } = require('axios');

const nonSecurePaths = ['/logout', '/login', '/register', '/verify-services'];

const authMiddleware = async (req, res, next) => {
    try {
        if (nonSecurePaths.includes(req.path)) return next();

        const cookies = req.cookies;
        const tokenFromHeader = jwtService.extractToken(req.headers.authorization);

        if (cookies?.accessToken || tokenFromHeader) {
            const token = cookies?.accessToken || tokenFromHeader;
            // call sso to verify token
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const resData = await axios.post(process.env.SSO_BACKEND_URL + '/api/v1/auth/verify-services');

            if (resData && resData.data.statusCode === 200) {
                req.user = resData.data.data;

                next();
            } else {
                return next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);
            }
        } else if (!cookies?.accessToken && cookies?.refreshToken) {
            res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
                statusCode: StatusCodes.METHOD_NOT_ALLOWED,
                message: 'TokenExpiredError & Need to retry new token',
                data: '',
            });
        } else {
            next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);
        }
    } catch (error) {
        next(error);
    }
};

const checkPermission = async (req, res, next) => {
    try {
        //
    } catch (error) {
        next(error);
    }
};

module.exports = { authMiddleware, checkPermission };
