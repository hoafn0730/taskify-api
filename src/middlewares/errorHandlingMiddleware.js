import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line no-unused-vars
export const errorHandlingMiddleware = (err, req, res, next) => {
    if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    const responseError = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
        stack: err.stack,
    };

    // Chỉ khi môi trường là DEV thì mới trả về Stack Trace để debug dễ dàng hơn, còn không thì xóa đi.
    if (process.env.BUILD_MODE !== 'dev') delete responseError.stack;

    // Đoạn này có thể mở rộng nhiều về sau như ghi Error Log vào file, bắn thông báo lỗi vào group Slack, Telegram, Email...vv Hoặc có thể viết riêng Code ra một file Middleware khác tùy dự án.
    // ...

    // eslint-disable-next-line no-console
    console.log('🚀 ~ errorHandlingMiddleware ~ responseError:', responseError);

    // Trả responseError về phía Front-end
    return res.status(responseError.statusCode).json(responseError);
};
