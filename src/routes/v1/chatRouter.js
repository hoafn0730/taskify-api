import express from 'express';
import chatController from '~/controllers/chatController';
// import { attachmentValidation } from '~/validations/attachmentValidation';

const router = express.Router();

router.get('/', chatController.get);
router.get('/:id', chatController.getOne);
router.get('/:id/messages', chatController.getMessages);
router.post('/', chatController.store);

export default router;
