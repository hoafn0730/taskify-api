import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import db from '~/models';
import JwtProvider from '~/providers/JwtProvider';
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
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data: resData } = await axios.post(process.env.SSO_BACKEND_URL + '/api/v1/auth/verify');

        if (resData && resData.statusCode === 200) {
            // eslint-disable-next-line no-unused-vars
            const { id, banner, bio, role, ...userData } = resData.data;
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
    } catch (error) {
        if (error?.message?.includes('jwt expired')) {
            return next(new ApiError(StatusCodes.GONE, 'Need to refresh token.'));
        }

        next(new ApiError(StatusCodes.UNAUTHORIZED, StatusCodes[StatusCodes.UNAUTHORIZED]));
    }
};

export default { isAuthorized };
