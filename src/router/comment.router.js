import KoaRouter from '@koa/router';
import { verifyAuth } from '../middleware/login.middleware.js';
import CommentController from '../controller/comment.controller.js';
export const commentRouter = new KoaRouter({ prefix: '/comment' });

/**
 * 新增评论评论
 */
commentRouter.post('/', verifyAuth, CommentController.create);

/**
 * 回复评论
 */
commentRouter.post('/reply', verifyAuth, CommentController.reply);
