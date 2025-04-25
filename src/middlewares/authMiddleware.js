import { StatusCodes } from 'http-status-codes';
import db from '~/models';
import { JwtProvider } from '~/providers/JwtProvider';
import { workspaceService } from '~/services';
import ApiError from '~/utils/ApiError';

const isAuthorized = async (req, res, next) => {
    const { accessToken } = req.cookies;
    const tokenFromHeader = JwtProvider.extractToken(req.headers.authorization);

    if (!(accessToken || tokenFromHeader)) {
        return next(new ApiError(StatusCodes.UNAUTHORIZED), 'UNAUTHORIZED token not found!');
    }

    try {
        const token = accessToken || tokenFromHeader;
        const decoded = JwtProvider.verifyToken(token);

        const user = await db.User.findOne({
            where: { id: decoded.id },
            attributes: {
                exclude: ['password', 'refreshToken'],
            },
        });

        req.user = { ...user.dataValues };
        next();
    } catch (error) {
        if (error?.message?.includes('jwt expired')) {
            return next(new ApiError(StatusCodes.GONE, 'Need to refresh token.'));
        }

        next(new ApiError(StatusCodes.UNAUTHORIZED, StatusCodes[StatusCodes.UNAUTHORIZED]));
    }
};

const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req?.user?.role)) {
            return next(new ApiError(StatusCodes.FORBIDDEN, 'You have no access!'));
        }

        next();
    };
};

export default { isAuthorized, checkRole };
