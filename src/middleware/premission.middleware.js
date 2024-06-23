import PermissionService from '../service/permission.service.js';
import { UNPERMISSION } from '../config/error.js';

export const verifyMomentPermission = async (ctx, next) => {
  // 1. 获取登录的用户id
  const { momentId } = ctx.params;
  const { id } = ctx.user;
  // 2. 根据动态id查询动态
  const isPermission = await PermissionService.checkMoment(momentId, id);
  if (!isPermission) {
    const error = new Error(UNPERMISSION);
    return ctx.app.emit('error', error, ctx);
  }
  await next();
};

/**
 * 通用的中间建封装
 * */
export const verifyPermission = () => {
  return async (ctx, next) => {
    // 1. 获取参数
    const { id } = ctx.user;
    const keyName = Object.keys(ctx.params)[0];
    const resourceId = ctx.params[keyName];
    const resourceName = keyName.replace('Id', '');
    // 2. 查询是否具备权限
    try {
      const isPermission = await PermissionService.checkResource(
        resourceName,
        resourceId,
        id
      );
      if (!isPermission) throw new Error();
      await next();
    } catch (err) {
      const error = new Error(UNPERMISSION);
      return ctx.app.emit('error', error, ctx);
    }
  };
};
