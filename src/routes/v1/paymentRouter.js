import express from 'express';
import paymentController from '~/controllers/paymentController';

const router = express.Router();

router.get('/', paymentController.get);
router.post('/', paymentController.store);

export default router;
