import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import db from '~/models';
import * as jwtService from '~/services/jwtService';
import ApiError from '~/utils/ApiError';

const authMiddleware = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const tokenFromHeader = jwtService.extractToken(req.headers.authorization);

        if (cookies?.accessToken || tokenFromHeader) {
            const token = cookies?.accessToken || tokenFromHeader;

            // call sso to verify token
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const resData = await axios.post(process.env.SSO_BACKEND_URL + '/api/v1/auth/verify');

            if (resData && resData.data.statusCode === 200) {
                const { id, banner, bio, ...userData } = resData.data.data;
                const [user] = await db.User.findOrCreate({
                    where: { uid: id },
                    defaults: {
                        ...userData,
                    },
                });
                req.user = user;

                next();
            } else {
                return next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);
            }
        } else if (!cookies?.accessToken && cookies?.refreshToken) {
            next(new ApiError(StatusCodes.METHOD_NOT_ALLOWED), 'TokenExpiredError & Need to retry new token');
        } else {
            next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);
        }
    } catch (error) {
        next(error);
    }
};

const checkAdmin = async (req, res, next) => {
    try {
        // todo
        // req.user log
        const { role } = await db.Member.findOne({ where: { userId: req.body.userId } });
        if (['admin', 'owner'].includes(role)) {
            next();
        } else {
            next(new ApiError(StatusCodes.FORBIDDEN), 'you dont permission to access this resource...');
        }
    } catch (error) {
        next(error);
    }
};

export { authMiddleware, checkAdmin };
