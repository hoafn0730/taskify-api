import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';
import { _labels } from '~/mocks/_mail';
import db from '~/models';
import { mailService } from '~/services';

// Cấu hình transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // hoặc smtp riêng nếu bạn có
    auth: {
        user: process.env.MAIL_USER, // email gửi
        pass: process.env.MAIL_PASS, // mật khẩu ứng dụng
    },
});

const getList = async (req, res, next) => {
    try {
        const labels = req.query.label.split(',');
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const mails = await mailService.get({ page, pageSize, where: { folder: { [Op.in]: labels } } });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            meta: mails.meta,
            data: mails.data,
        });
    } catch (error) {
        next(error);
    }
};

const getOne = async (req, res, next) => {
    try {
        const mailId = req.params.id;
        const mail = await mailService.getOne({ where: { id: mailId } });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: mail,
        });
    } catch (error) {
        next(error);
    }
};

const getLabels = async (req, res, next) => {
    try {
        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: _labels,
        });
    } catch (error) {
        next(error);
    }
};

const save = async (req, res, next) => {
    const { id, ...rest } = req.body;

    try {
        const [mail, created] = await db.Mail.upsert({ id, ...rest }, { returning: true });

        res.status(created ? StatusCodes.CREATED : StatusCodes.OK).json({
            statusCode: created ? StatusCodes.CREATED : StatusCodes.OK,
            message: created ? 'Email đã được tạo mới' : 'Email đã được cập nhật',
            data: mail,
        });
    } catch (error) {
        next(error);
    }
};

const send = async (req, res, next) => {
    try {
        const { to, subject, html, mailId } = req.body;

        if (!to || !subject || !html) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Thiếu thông tin gửi mail',
            });
        }

        const info = await transporter.sendMail({
            from: `"MyApp" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });

        await db.Mail.update({ type: 'sent' }, { where: { id: mailId } });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: 'Gửi mail thành công',
            data: info,
        });
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const mailId = req.params.id;

        const deleted = await mailService.destroy(mailId);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: deleted,
        });
    } catch (error) {
        next(error);
    }
};

export default { getList, getOne, getLabels, save, send, destroy };
