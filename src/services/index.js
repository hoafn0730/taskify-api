import db from '~/models';
import createService from '~/utils/createService';

// Tạo service cho từng model

export const commentService = createService(db.Comment);
