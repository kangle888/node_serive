import Router from '@koa/router';
import userController from '../controller/user.controller.js';
import { verifyUser, handlePassword } from '../middleware/user.middleware.js';
import { verifyAuth } from '../middleware/login.middleware.js';

// 创建一个路由实例
export const userRouter = new Router({ prefix: '/user' });

// 定义路由
// 用户注册接口
// 这里需要给密码进行加密操作增加中间件
userRouter.post('/', verifyUser, handlePassword, userController.create);

// 根据用户id获取用户信息
userRouter.get('/role', userController.getUserInfo);
