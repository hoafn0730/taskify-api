const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ADDRESS, // email Gmail của bạn
        pass: process.env.GMAIL_APP_PASSWORD, // Mật khẩu ứng dụng (App Password), KHÔNG phải mật khẩu tài khoản Google
    },
});

const sendEmail = ({ email, sender, subject, htmlContent }) => {
    const mailOptions = {
        from: `"${sender?.name || 'Hoafn0730'}" <${sender?.email || process.env.GMAIL_ADDRESS}>`,
        to: email,
        subject: subject,
        html: htmlContent,
    };

    return transporter.sendMail(mailOptions);
};

module.exports.NodemailerProvider = { sendEmail };
