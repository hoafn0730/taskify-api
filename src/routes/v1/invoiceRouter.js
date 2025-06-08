import express from 'express';
import invoiceController from '~/controllers/invoiceController';

const router = express.Router();

router.get('/', invoiceController.get);
router.get('/:id', invoiceController.getOne);
router.post('/', invoiceController.store);

export default router;
