import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

const WHITELIST_DOMAINS = (process.env.CORS_ORIGIN ?? '').split(',');

export const corsOptions = {
    origin: function (origin, callback) {
        // Cho phép việc gọi API bằng POSTMAN trên môi trường dev,
        if (process.env.BUILD_MODE === 'dev') {
            return callback(null, true);
        }

        // Kiểm tra xem origin có phải là domain được chấp nhận hay không
        if (WHITELIST_DOMAINS.includes(origin)) {
            return callback(null, true);
        }

        // Cuối cùng nếu domain không được chấp nhận thì trả về lỗi
        return callback(new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`));
    },

    // Some legacy browsers (IE11, various SmartTVs) choke on 204
    optionsSuccessStatus: 200,
    // CORS sẽ cho phép nhận cookies từ request
    credentials: true,
};
