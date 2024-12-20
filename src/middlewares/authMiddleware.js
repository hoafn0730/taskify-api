import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import db from '~/models';
import JwtProvider from '~/providers/JwtProvider';
import { workspaceService } from '~/services';
import ApiError from '~/utils/ApiError';

const isAuthorized = async (req, res, next) => {
    const { accessToken } = req.cookies;
    const tokenFromHeader = JwtProvider.extractToken(req.headers.authorization);

    if (!accessToken && !tokenFromHeader) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED token not found!'));
    }

    try {
        const token = accessToken || tokenFromHeader;

        // call sso to verify token
        const cookieHeader = Object.entries(req.cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join(';');

        const { data: resData } = await axios.post(process.env.SSO_BACKEND_URL + '/api/v1/auth/verify', null, {
            headers: {
                Authorization: `Bearer ${token}`,
                Cookie: cookieHeader,
            },
        });

        // eslint-disable-next-line no-unused-vars
        const { id, banner, bio, role, active, ...userData } = resData.data;
        const [user, created] = await db.User.findOrCreate({
            where: { uid: id },
            defaults: {
                ...userData,
            },
        });

        if (created) {
            await workspaceService.store({ userId: user.id, title: 'TaskFlow', type: 'private' });
        }
        req.user = { ...user.dataValues, role };

        next();
    } catch (error) {
        next(error);
    }
};

const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user && !roles.includes(req?.user?.role)) {
            return next(new ApiError(StatusCodes.FORBIDDEN, 'You have no access!'));
        }

        next();
    };
};

export default { isAuthorized, checkRole };
