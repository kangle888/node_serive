import KoaRouter from '@koa/router';
import LoginController from '../controller/login.controller.js';
import { varifyLogin, verifyAuth } from '../middleware/login.middleware.js';

export const loginRouter = new KoaRouter({ prefix: '/login' });

loginRouter.post('/', varifyLogin, LoginController.sign);

// 测试接口
loginRouter.get('/test', verifyAuth, LoginController.test);
