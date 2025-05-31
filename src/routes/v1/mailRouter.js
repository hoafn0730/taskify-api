import express from 'express';
import mailController from '~/controllers/mailController';
import { mailValidation } from '~/validations/mailValidation';

const router = express.Router();

router.get('/list', mailController.getList);
router.get('/labels', mailController.getLabels);
router.get('/:id', mailController.getOne);
router.post('/save', mailValidation.save, mailController.save);
router.post('/:id/send', mailController.send);
router.delete('/:id', mailValidation.destroy, mailController.destroy);

export default router;
