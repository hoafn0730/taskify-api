import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

@Entity('Invoices')
export class Invoice extends BaseEntity {
    @Column({ unique: true })
    code: string;

    @Column({ type: 'float' })
    amount: number;

    @Column({
        type: 'enum',
        enum: ['unpaid', 'paid', 'overdue'],
        default: 'unpaid',
    })
    status: string;

    @Column({ type: 'timestamp' })
    dueDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    paidAt: Date;

    @Column({ nullable: true })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @OneToOne(() => Transaction, (transaction) => transaction.invoice)
    transaction: Transaction;
}
