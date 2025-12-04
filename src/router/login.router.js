import KoaRouter from '@koa/router';
import Joi from 'joi';
import LoginController from '../controller/login.controller.js';
import { varifyLogin, verifyAuth } from '../middleware/login.middleware.js';
import { verifyWechatLogin } from '../middleware/wechat.middleware.js';
import { validate } from '../utils/validator.js';

export const loginRouter = new KoaRouter({ prefix: '/login' });

// 传统登录参数校验
const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).max(100).required()
});

// 微信登录参数校验
const wechatLoginSchema = Joi.object({
  code: Joi.string().required(),
  userInfo: Joi.object({
    nickName: Joi.string().allow('', null).optional(),
    avatarUrl: Joi.string().uri().allow('', null).optional(),
    gender: Joi.number().allow(null).optional(),
    country: Joi.string().allow('', null).optional(),
    province: Joi.string().allow('', null).optional(),
    city: Joi.string().allow('', null).optional()
  }).optional()
});

/**
 * @openapi
 * /login:
 *   post:
 *     summary: 用户登录（传统方式）
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

/**
 * @openapi
 * /login/wechat:
 *   post:
 *     summary: 微信小程序登录
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: 微信登录凭证
 *               userInfo:
 *                 type: object
 *                 description: 用户信息（可选）
 *     responses:
 *       200:
 *         description: 登录成功，返回 token 和用户信息
 */
loginRouter.post('/wechat', validate(wechatLoginSchema), verifyWechatLogin, LoginController.wechatSign);

// 测试接口
loginRouter.get('/test', verifyAuth, LoginController.test);
