import express from 'express';
import transactionController from '~/controllers/transactionController';
import { transactionValidation } from '~/validations/transactionValidation';

const router = express.Router();

router.get('/', transactionController.get);
router.post('/', transactionController.store);
router.put('/:id', transactionValidation.update, transactionController.update);
router.delete('/:id', transactionValidation.destroy, transactionController.destroy);

export default router;
