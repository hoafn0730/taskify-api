import { StatusCodes } from 'http-status-codes';
import { invoiceService, transactionService } from '~/services';

const get = async (req, res, next) => {
    try {
        const page = req.query.page;
        const pageSize = req.query.pageSize;
        const userId = req.user.id;

        const invoices = await invoiceService.get({ page, pageSize, where: { userId } });

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: invoices,
        });
    } catch (error) {
        next(error);
    }
};

const store = async (req, res, next) => {
    const data = req.body;
    try {
        // Tạo transaction trước
        const transaction = await transactionService.store({
            userId: req.user.id,
            gateway: data.gateway,
            transactionDate: data.transactionDate,
            accountNumber: data.accountNumber,
            subAccount: data.subAccount,
            amountIn: data.transferAmount,
            accumulated: data.accumulated,
            code: data.code,
            transactionContent: data.description,
            referenceNumber: data.referenceCode,
            body: data.id,
        });

        // Tạo invoice tương ứng
        const invoice = await invoiceService.store({
            userId: req.user.id,
            code: `INV-${data?.id || data?.code}`,
            amount: data.transferAmount,
            status: 'paid',
            dueDate: data.transactionDate || new Date(),
            paidAt: new Date(),
        });

        // Cập nhật invoiceId cho transaction
        await transaction.update({ invoiceId: invoice.id });

        res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            message: StatusCodes[StatusCodes.CREATED],
            data: {
                transaction,
                invoice,
            },
        });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const transactionId = req.params.id;
        const updated = await transactionService.update(transactionId, req.body);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

const destroy = async (req, res, next) => {
    try {
        const transactionId = req.params.id;
        const deleted = await transactionService.destroy(transactionId);

        res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            message: StatusCodes[StatusCodes.OK],
            data: deleted,
        });
    } catch (error) {
        next(error);
    }
};

export default { get, store, update, destroy };
