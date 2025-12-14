import Router from '@koa/router';
import Joi from 'joi';
import userController from '../controller/user.controller.js';
import { verifyUser, handlePassword } from '../middleware/user.middleware.js';
import { validate } from '../utils/validator.js';
import { verifyAuth } from '../middleware/login.middleware.js';

// 创建一个路由实例
export const userRouter = new Router({ prefix: '/user' });

// 注册参数校验
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).max(100).required()
});

/**
 * @openapi
 * /user:
 *   post:
 *     summary: 用户注册
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 注册成功
 */
userRouter.post(
  '/',
  validate(registerSchema),
  verifyUser,
  handlePassword,
  userController.create
);

// 根据用户id获取角色信息
userRouter.get('/role', userController.getUserInfo);

// 根据roleId获取用户菜单信息
userRouter.get('/menu', userController.getUserMenu);

// 头像可能是本地文件路径（非 URL），放宽校验
const updateProfileSchema = Joi.object({
  nickname: Joi.string().max(50).allow('', null),
  avatar_url: Joi.string().max(512).allow('', null),
  username: Joi.string().max(50).allow('', null),
  phone: Joi.string().max(30).allow('', null)
});

// 条件验证中间件：multipart 请求跳过验证，JSON 请求进行验证
const conditionalValidate = (schema) => {
  return async (ctx, next) => {
    const isMultipart = ctx.headers['content-type']?.includes(
      'multipart/form-data'
    );
    if (isMultipart) {
      // multipart 请求跳过验证，由 controller 处理
      await next();
    } else {
      // JSON 请求进行验证
      return validate(schema)(ctx, next);
    }
  };
};

userRouter.post(
  '/profile',
  verifyAuth,
  conditionalValidate(updateProfileSchema),
  userController.updateProfile
);
