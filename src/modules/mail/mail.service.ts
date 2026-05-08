import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, FindOptionsWhere } from 'typeorm';
import { Mail } from '../../entities/mail.entity';
import { User } from '../../entities/user.entity';
import { BaseService } from '../../common/base.service';
import { MailProvider } from './mail.provider';
import { SaveMailDto } from './dto/mail.dto';

@Injectable()
export class MailService extends BaseService<Mail> {
    constructor(
        @InjectRepository(Mail)
        private mailRepository: Repository<Mail>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private mailProvider: MailProvider,
    ) {
        super(mailRepository);
    }

    async getList(userId: number, page: number = 1, pageSize: number = 20, label?: string) {
        const whereCondition: FindOptionsWhere<Mail>[] = [{ to: userId }, { from: userId }];

        if (label && label !== 'all') {
            const labels = label.split(',');
            whereCondition.forEach((cond) => {
                cond.folder = In(labels);
            });
        }

        const [data, total] = await this.mailRepository.findAndCount({
            where: whereCondition,
            relations: ['sender', 'recipient'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            data,
            meta: {
                total,
                page,
                pageSize,
            },
        };
    }

    async saveMail(userId: number, data: SaveMailDto) {
        const { id, to, ...rest } = data;

        let recipientId: number | undefined;
        if (to && to.length > 0) {
            const recipient = await this.userRepository.findOne({ where: { email: to[0] } });
            if (recipient) {
                recipientId = recipient.id;
            }
        }

        if (id) {
            await this.mailRepository.update(id, { ...rest, to: recipientId, from: userId });
            const updatedMail = await this.mailRepository.findOne({ where: { id } });
            if (!updatedMail) throw new NotFoundException('Mail not found after update');
            return updatedMail;
        } else {
            const mail = this.mailRepository.create({ ...rest, to: recipientId, from: userId });
            return this.mailRepository.save(mail);
        }
    }

    async sendMail(mailId: number) {
        const mail = await this.mailRepository.findOne({
            where: { id: mailId },
            relations: ['recipient'],
        });

        if (!mail || !mail.recipient || !mail.recipient.email) {
            throw new NotFoundException(!mail ? 'Email không tồn tại' : 'Người nhận không tồn tại');
        }

        const info = await this.mailProvider.sendEmail({
            email: mail.recipient.email,
            subject: mail.subject || 'Thông báo từ Taskify',
            htmlContent: mail.message || '<p>Đây là nội dung email từ Taskify.</p>',
        });

        await this.mailRepository.update(mailId, { folder: 'sent' });

        return info;
    }
}
