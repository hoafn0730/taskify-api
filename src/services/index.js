import db from '~/models';
import createService from '~/utils/createService';

// Tạo service cho từng model
export const commentService = createService(db.Comment);
export const userService = createService(db.User);
export const memberService = createService(db.Member);
export const notificationService = createService(db.Notification);
