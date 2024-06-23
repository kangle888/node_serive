import KoaRouter from '@koa/router';
import { verifyAuth } from '../middleware/login.middleware.js';
import MomentController from '../controller/moment.controller.js';
import { verifyMomentPermission } from '../middleware/premission.middleware.js';

export const momentRouter = new KoaRouter({ prefix: '/moment' });
/**
 * 增加动态
 */
momentRouter.post('/', verifyAuth, MomentController.create);

/**
 * 查询动态列表
 */
momentRouter.get('/', MomentController.list);
momentRouter.get('/:momentId', MomentController.detail);

/**
 * 修改动态
 * 只有登录用户才能修改自己的动态
 */
momentRouter.patch(
  '/:momentId',
  verifyAuth,
  verifyMomentPermission,
  MomentController.update
);

/**
 * 删除动态
 */

momentRouter.delete(
  '/:momentId',
  verifyAuth,
  verifyMomentPermission,
  MomentController.remove
);
