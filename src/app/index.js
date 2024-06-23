import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors'; // 导入 @koa/cors
// import { registerRouter } from '../router/index.js';
import { userRouter } from '../router/user.router.js';
import { loginRouter } from '../router/login.router.js';
import { momentRouter } from '../router/moment.router.js';
import { commentRouter } from '../router/comment.router.js';
// 1. 创建中间件
const app = new koa();
// 使用 CORS 中间件
app.use(cors());

// 2. 注册中间件
app.use(bodyParser());
// 3. 注册路由
// registerRouter(app);
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
// 3. 注册路由
app.use(loginRouter.routes());
app.use(loginRouter.allowedMethods());

// 3. 注册路由
app.use(momentRouter.routes());
app.use(momentRouter.allowedMethods());

// 3. 注册路由
app.use(commentRouter.routes());
app.use(commentRouter.allowedMethods());

// 导出app
export default app;
