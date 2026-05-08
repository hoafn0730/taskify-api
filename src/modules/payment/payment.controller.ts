import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { CreatePaymentDto, UpdateTransactionDto } from './dto/payment.dto';

@ApiTags('Payment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @ApiOperation({ summary: 'Get invoices for user' })
    @Get()
    async findAll(
        @Req() req: RequestWithUser,
        @Query('page') page: number = 1,
        @Query('pageSize') pageSize: number = 10,
    ) {
        return this.paymentService.getInvoices(req.user.id, page, pageSize);
    }

    @ApiOperation({ summary: 'Create payment (transaction + invoice)' })
    @Post()
    async create(@Req() req: RequestWithUser, @Body() data: CreatePaymentDto) {
        return this.paymentService.createPayment(req.user.id, data);
    }

    @ApiOperation({ summary: 'Update transaction' })
    @Put(':id')
    async update(@Param('id') id: number, @Body() data: UpdateTransactionDto) {
        return this.paymentService.update(id, data);
    }

    @ApiOperation({ summary: 'Delete transaction' })
    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.paymentService.delete(id);
    }
}

