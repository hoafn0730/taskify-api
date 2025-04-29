// const passport = require('passport');
import uuidv4 from 'uuid';
import ms from 'ms';

import { authService } from '~/services/authService';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';
import db from '~/models';
import { JwtProvider } from '~/providers/JwtProvider';

// const { authenticator } = require('otplib');
// const QRCode = require('qrcode');

// const BrevoProvider = require('../providers/BrevoProvider');

const signIn = async (req, res, next) => {
    try {
        const body = req.body;
        const resData = await authService.signIn({ email: body.email, password: body.password });

        // Tìm hoặc tạo workspace
        const [workspace, created] = await db.Workspace.findOrCreate({
            where: { userId: resData.id },
            defaults: {
                title: `${resData.username}'s Workspace`, // Tên mặc định cho workspace
                type: 'personal', // Loại workspace (có thể thay đổi nếu cần)
            },
        });

        if (created) {
            console.log('New workspace created:', workspace.title);
        }

        //
        // await authService.updateUserCode(req.user.type, req.user.email, refreshToken);

        // Đặt Access Token vào cookie
        res.cookie('accessToken', resData.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: process.env.COOKIE_DOMAIN,
            maxAge: ms('14 days'),
        });

        // Đặt Refresh Token vào cookie
        res.cookie('refreshToken', resData.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: process.env.COOKIE_DOMAIN,
            maxAge: ms('14 days'),
        });

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: 'login success',
            data: { ...resData, workspace },
        });
    } catch (error) {
        next(error);
    }
};

const signUp = async (req, res, next) => {
    try {
        const data = await authService.signUp(req.body);

        // Send email verify
        // const verificationLink = `${process.env.WEBSITE_DOMAIN}/verify-account?email=${data.email}$token=${data.code}`;
        // const customSubject = 'Account Verification - Please Confirm Your Email';
        // const htmlContent = `
        //     <h3>Hello, ${data.email}!</h3>
        //     <p>Thank you for signing up. To complete your account setup, please verify your email address.</p>
        //     <p><a href="${verificationLink}">${verificationLink}</a></p>
        //     <p>Click the link above to verify your account and start using our services.</p>
        //     `;
        // await BrevoProvider.sendEmail(data.email, customSubject, htmlContent);

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        //
        res.clearCookie('accessToken', { domain: process.env.COOKIE_DOMAIN });
        res.clearCookie('refreshToken', { domain: process.env.COOKIE_DOMAIN });
        res.clearCookie('connect.sid', { domain: process.env.COOKIE_DOMAIN });
        req.session.destroy();

        res.json({ statusCode: StatusCodes.OK, message: StatusCodes[StatusCodes.OK] });
    });
};

const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);

        const user = await db.User.findOne({ where: { code: refreshToken }, raw: true });

        if (!user) {
            return next(new ApiError(StatusCodes.UNAUTHORIZED), StatusCodes[StatusCodes.UNAUTHORIZED]);
        }

        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
        };

        // Tạo Access Token và Refresh Token
        const newAccessToken = JwtProvider.createToken(payload);
        const newRefreshToken = uuidv4();
        await authService.updateUserCode(user.type, user.email, newRefreshToken);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            domain: process.env.COOKIE_DOMAIN,
            maxAge: ms('14 days'),
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            domain: process.env.COOKIE_DOMAIN,
            maxAge: ms('14 days'),
        });

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
        });
    } catch (error) {
        next(error);
    }
};

const getCurrentUser = async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
            },
            attributes: { exclude: ['password', 'type', 'code'] },
            raw: true,
        });

        if (user.require2FA) {
            user.is2FAVerified = req.session.passport.user.is2FAVerified;
            user.lastLogin = req.session.passport.user.lastLogin;
        }

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const verifyAccount = async (req, res, next) => {
    const { email, token } = req.body;

    try {
        const resData = await authService.verifyAccount('LOCAL', email, token);

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: resData.message || StatusCodes[StatusCodes.OK],
            data: resData.data,
        });
    } catch (error) {
        next(error);
    }
};

export const authController = {
    signIn,
    signUp,
    logout,
    refreshToken,
    getCurrentUser,
    verifyAccount,
};
