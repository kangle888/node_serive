import UserService from '../service/user.service.js';
import {
  NAME_ALREADY_EXISTS,
  NAME_OR_PASSWORD_IS_REQUIRED
} from '../config/error.js';
import { md5Password } from '../utils/md5-password.js';

export const verifyUser = async (ctx, next) => {
  // 1.接收用户请求传递的参数
  const user = ctx.request.body;
  // 2 验证客户端传递的参数username和password是否可以存放导数据库
  // 2.1 验证用户名和密码不能为空
  if (!user.username || !user.password) {
    const error = new Error(NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit('error', error, ctx);
  }

  // 2.2 验证用户名是否已经存在数据库
  const { username } = user;
  const users = await UserService.getUserByName(username);
  if (Array.isArray(users[0]) && users[0].length) {
    // console.log('用户已经存在', users[0]);
    const error = new Error(NAME_ALREADY_EXISTS);
    return ctx.app.emit('error', error, ctx);
  }

  await next();
};

// 用户密码加密
export const handlePassword = async (ctx, next) => {
  // 1 获取用户密码
  const { password } = ctx.request.body;
  // 2 密码加密
  ctx.request.body.password = md5Password(password);
  await next();
};

// 登录验证
