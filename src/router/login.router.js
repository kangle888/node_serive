import KoaRouter from '@koa/router';
import Joi from 'joi';
import LoginController from '../controller/login.controller.js';
import { varifyLogin, verifyAuth } from '../middleware/login.middleware.js';
import { validate } from '../utils/validator.js';

export const loginRouter = new KoaRouter({ prefix: '/login' });

// 登录参数校验
const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).max(100).required()
});

/**
 * @openapi
 * /login:
 *   post:
 *     summary: 用户登录
 *     tags:
 *       - Auth
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
 *         description: 登录成功，返回 token
 */
loginRouter.post('/', validate(loginSchema), varifyLogin, LoginController.sign);

// 测试接口
loginRouter.get('/test', verifyAuth, LoginController.test);
