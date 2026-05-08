import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailProvider {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get<string>('GMAIL_ADDRESS'),
                pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
            },
        });
    }

    async sendEmail({
        email,
        sender,
        subject,
        htmlContent,
    }: {
        email: string;
        sender?: { name: string; email: string };
        subject: string;
        htmlContent: string;
    }) {
        const mailOptions = {
            from: `"${sender?.name || 'Taskify'}" <${sender?.email || this.configService.get<string>('GMAIL_ADDRESS')}>`,
            to: email,
            subject: subject,
            html: htmlContent,
        };

        return this.transporter.sendMail(mailOptions);
    }
}
