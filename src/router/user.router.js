import Router from '@koa/router';
import Joi from 'joi';
import userController from '../controller/user.controller.js';
import { verifyUser, handlePassword } from '../middleware/user.middleware.js';
import { validate } from '../utils/validator.js';

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
userRouter.post('/', validate(registerSchema), verifyUser, handlePassword, userController.create);

// 根据用户id获取角色信息
userRouter.get('/role', userController.getUserInfo);

// 根据roleId获取用户菜单信息
userRouter.get('/menu', userController.getUserMenu);
