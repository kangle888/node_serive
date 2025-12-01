import {
  NAME_OR_PASSWORD_IS_REQUIRED,
  PASSWORD_IS_INCORRENT,
  USER_DOES_NOT_EXISTS,
  UNAUTHORIZATION
} from '../config/error.js';
import { PUBLIC_KEY } from '../config/screct.js';
import jwt from 'jsonwebtoken';
import { md5Password } from '../utils/md5-password.js';
import UserService from '../service/user.service.js';

export const varifyLogin = async (ctx, next) => {
  // 1 获取用户名和密码
  const { username, password } = ctx.request.body;
  // 2 判断用户名和密码是否为空
  if (!username || !password) {
    const error = new Error(NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit('error', error, ctx);
  }
  // 3 判断用户名是否存在
  const user = await UserService.getUserByName(username);
  if (!user) {
    const error = new Error(USER_DOES_NOT_EXISTS);
    return ctx.app.emit('error', error, ctx);
  }
  // 4 查询数据库中密码和用户输入的密码是否一致
  if (user.password !== md5Password(password)) {
    const error = new Error(PASSWORD_IS_INCORRENT);
    return ctx.app.emit('error', error, ctx);
  }

  // 5. 将用户信息挂载到ctx上
  ctx.user = user;
  await next();
};

// 验证token是否有效
export const verifyAuth = async (ctx, next) => {
  // 1.获取token
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(UNAUTHORIZATION);
    return ctx.app.emit('error', error, ctx);
  }
  const token = authorization.replace('Bearer ', '');
  // 2.验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256']
    });
    ctx.user = result;
    await next();
  } catch (err) {
    const error = new Error(UNAUTHORIZATION);
    ctx.app.emit('error', error, ctx);
  }
};
