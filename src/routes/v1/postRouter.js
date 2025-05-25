import express from 'express';
import postController from '~/controllers/postController';
import { postValidation } from '~/validations/postValidation';

const router = express.Router();

router.get('/', postController.get);
router.get('/:slug', postController.getOne);
router.post(
    '/',
    //  portValidation.store,
    postController.store,
);
router.put(
    '/:id',
    //  portValidation.update,
    postController.update,
);
router.delete(
    '/:id',
    // portValidation.destroy,
    postController.destroy,
);

export default router;
