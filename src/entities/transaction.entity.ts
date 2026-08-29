import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Invoice } from './invoice.entity';

@Entity('Transactions')
export class Transaction extends BaseEntity {
    @Column()
    userId: number;

    @Column({ nullable: true })
    invoiceId: number;

    @Column({ nullable: true })
    gateway: string;

    @Column({ type: 'timestamp', nullable: true })
    transactionDate: Date;

    @Column({ nullable: true })
    accountNumber: string;

    @Column({ nullable: true })
    subAccount: string;

    @Column({ default: 0 })
    amountIn: number;

    @Column({ default: 0 })
    amountOut: number;

    @Column({ default: 0 })
    accumulated: number;

    @Column({ nullable: true })
    code: string;

    @Column({ type: 'text', nullable: true })
    transactionContent: string;

    @Column({ nullable: true })
    referenceNumber: string;

    @Column({ type: 'text', nullable: true })
    body: string;

    @Column({ nullable: true })
    status: string;

    @ManyToOne(() => Invoice)
    @JoinColumn({ name: 'invoiceId' })
    invoice: Invoice;
}
