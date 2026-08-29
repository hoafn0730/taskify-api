import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction } from '../../entities/transaction.entity';
import { Invoice } from '../../entities/invoice.entity';
import { BaseService } from '../../common/base.service';
import { CreatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService extends BaseService<Transaction> {
    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,
        private dataSource: DataSource,
    ) {
        super(transactionRepository);
    }

    async getInvoices(userId: number, page: number = 1, pageSize: number = 10) {
        const [data, total] = await this.invoiceRepository.findAndCount({
            where: { userId },
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

    async createPayment(userId: number, data: CreatePaymentDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const transaction = this.transactionRepository.create({
                userId,
                gateway: data.gateway,
                transactionDate: data.transactionDate ? new Date(data.transactionDate) : new Date(),
                accountNumber: data.accountNumber,
                subAccount: data.subAccount,
                amountIn: data.transferAmount,
                accumulated: data.accumulated,
                code: data.code,
                transactionContent: data.description,
                referenceNumber: data.referenceCode,
                body: data.id,
            });
            const savedTransaction = await queryRunner.manager.save(transaction);

            const invoice = this.invoiceRepository.create({
                userId,
                code: `INV-${data?.id || data?.code}`,
                amount: data.transferAmount,
                status: 'paid',
                dueDate: data.transactionDate ? new Date(data.transactionDate) : new Date(),
                paidAt: new Date(),
            });
            const savedInvoice = await queryRunner.manager.save(invoice);

            savedTransaction.invoiceId = savedInvoice.id;
            await queryRunner.manager.save(savedTransaction);

            await queryRunner.commitTransaction();

            return {
                transaction: savedTransaction,
                invoice: savedInvoice,
            };
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
