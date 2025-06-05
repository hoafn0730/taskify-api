import db from '~/models';
import { JwtProvider } from '~/providers/JwtProvider';
// Helper function to parse cookies from Socket.IO handshake
const parseCookies = (cookieHeader) => {
    const cookies = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach((cookie) => {
            const [name, value] = cookie.trim().split('=');
            if (name && value) {
                cookies[name] = decodeURIComponent(value);
            }
        });
    }
    return cookies;
};
// Socket.IO authentication middleware
const socketMiddleware = async (socket, next) => {
    try {
        // Lấy cookie từ socket handshake headers
        const cookieHeader = socket.handshake.headers.cookie;
        const cookies = parseCookies(cookieHeader);

        // Các tên cookie có thể dùng (tùy config)
        const token = cookies.token || cookies.accessToken || cookies.authToken || socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        const decoded = JwtProvider.verifyToken(token);
        const user = await db.User.findByPk(decoded.id, {
            attributes: ['id', 'username', 'email', 'displayName', 'avatar', 'activityStatus'],
        });

        if (!user) {
            return next(new Error('User not found'));
        }

        socket.user = user;
        next();
    } catch (err) {
        next(new Error('Authentication error'));
    }
};

export default socketMiddleware;
