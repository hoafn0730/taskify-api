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
        user: process.env.GMAIL_ADDRESS, // email gửi
        pass: process.env.GMAIL_APP_PASSWORD, // mật khẩu ứng dụng
    },
});

const getList = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 20;
        const userId = req.user.id; // Assuming user is attached to request

        const whereCondition = {
            [Op.or]: [
                { to: userId }, // Received mails
                { from: userId }, // Sent mails
            ],
        };

        // Only add folder condition if label is not 'all'
        if (req.query.label && req.query.label !== 'all') {
            const labels = req.query.label.split(',');
            whereCondition.folder = { [Op.in]: labels };
        }

        const mails = await mailService.get({
            page,
            pageSize,
            where: whereCondition,
            include: [
                {
                    association: 'sender',
                    attributes: ['id', 'email', 'displayName', 'avatar'],
                },
                {
                    association: 'recipient',
                    attributes: ['id', 'email', 'displayName', 'avatar'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

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
        const mail = await mailService.getOne({
            where: { id: mailId },
            include: [
                {
                    association: 'sender',
                    attributes: ['id', 'email', 'displayName', 'avatar'],
                },
                {
                    association: 'recipient',
                    attributes: ['id', 'email', 'displayName', 'avatar'],
                },
            ],
        });

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
    try {
        const { id, ...rest } = req.body;
        const user = await db.User.findOne({ where: { email: rest.to } });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                statusCode: StatusCodes.NOT_FOUND,
                message: 'Người nhận không tồn tại',
            });
        }

        const [mail, created] = await db.Mail.upsert({ id, ...rest, to: user.id }, { returning: true });

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
        const mailId = req.params.id;
        const mail = await mailService.getOne({ where: { id: mailId } });
        if (!mail) {
            return res.status(StatusCodes.NOT_FOUND).json({
                statusCode: StatusCodes.NOT_FOUND,
                message: 'Email không tồn tại',
            });
        }
        const user = await db.User.findOne({ where: { id: mail.to } });

        if (!mail || !user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                statusCode: StatusCodes.NOT_FOUND,
                message: !mail ? 'Email không tồn tại' : 'Người nhận không tồn tại',
            });
        }

        const mailOptions = {
            from: `"MyApp" <${process.env.GMAIL_ADDRESS}>`,
            to: user.email,
            subject: mail.subject || 'Thông báo từ MyApp',
            html: mail.message || '<p>Đây là nội dung email từ MyApp.</p>',
        };

        const info = await transporter.sendMail(mailOptions);
        await db.Mail.update({ folder: 'sent' }, { where: { id: mailId } });

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
