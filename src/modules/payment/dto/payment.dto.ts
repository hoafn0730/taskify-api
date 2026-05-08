import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
    @ApiProperty({ example: 'stripe' })
    @IsString()
    @IsNotEmpty()
    gateway: string;

    @ApiProperty({ example: '2023-12-31T23:59:59Z', required: false })
    @IsDateString()
    @IsOptional()
    transactionDate?: string;

    @ApiProperty({ example: '123456789', required: false })
    @IsString()
    @IsOptional()
    accountNumber?: string;

    @ApiProperty({ example: 'sub123', required: false })
    @IsString()
    @IsOptional()
    subAccount?: string;

    @ApiProperty({ example: 100 })
    @IsNumber()
    @IsNotEmpty()
    transferAmount: number;

    @ApiProperty({ example: 1000, required: false })
    @IsNumber()
    @IsOptional()
    accumulated?: number;

    @ApiProperty({ example: 'TX123' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'Payment for service' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'REF123', required: false })
    @IsString()
    @IsOptional()
    referenceCode?: string;

    @ApiProperty({ example: 'body123', required: false })
    @IsString()
    @IsOptional()
    id?: string;
}

export class UpdateTransactionDto {
    @ApiProperty({ example: 'completed', enum: ['pending', 'completed', 'failed'] })
    @IsEnum(['pending', 'completed', 'failed'])
    @IsOptional()
    status?: string;
}
