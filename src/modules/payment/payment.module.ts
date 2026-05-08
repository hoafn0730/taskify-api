import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Transaction } from '../../entities/transaction.entity';
import { Invoice } from '../../entities/invoice.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Transaction, Invoice])],
    controllers: [PaymentController],
    providers: [PaymentService],
    exports: [PaymentService],
})
export class PaymentModule {}
