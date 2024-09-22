import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors'; // 导入 @koa/cors
// import { registerRouter } from '../router/index.js';
import { userRouter } from '../router/user.router.js';
import { loginRouter } from '../router/login.router.js';
import { momentRouter } from '../router/moment.router.js';
import { uploadFileRouter } from '../router/uploadFile.router.js';
import { virtualListRouter } from '../router/virtualList.router.js'
import {formDataListRouter} from '../router/formDataList.router.js'


// 1. 创建中间件
const app = new koa();
// 使用 CORS 中间件
app.use(cors());

// 2. 注册中间件
app.use(bodyParser({
  enableTypes: ['json', 'form', 'text'],  // 禁用 multipart/form-data
}));
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
app.use(uploadFileRouter.routes());
app.use(uploadFileRouter.allowedMethods());

// 3. 注册路由
app.use(virtualListRouter.routes());
app.use(virtualListRouter.allowedMethods());

// 3. 注册路由
app.use(formDataListRouter.routes());
app.use(formDataListRouter.allowedMethods());

// 导出app
export default app;
