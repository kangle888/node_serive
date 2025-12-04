import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import ratelimit from 'koa-ratelimit';
import serve from 'koa-static';
import Router from '@koa/router';
import { koaSwagger } from 'koa2-swagger-ui';
import { userRouter } from '../router/user.router.js';
import { loginRouter } from '../router/login.router.js';
import { uploadFileRouter } from '../router/uploadFile.router.js';
import { roomRouter } from '../router/room.router.js';
import { healthRecordRouter } from '../router/healthRecord.router.js';
import { swaggerSpecs } from '../config/swagger.js';
import { logger } from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 创建 Koa 应用
const app = new Koa();

// 2. 安全相关中间件（关闭 CSP，避免影响 Swagger 外链和内联脚本）
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

// 3. CORS 配置
app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
  })
);

// 4. 请求日志
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger.info(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);
});

// 5. 预检请求处理
app.use(async (ctx, next) => {
  if (ctx.method === 'OPTIONS') {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    ctx.status = 204;
  } else {
    await next();
  }
});

// 6. 限流（基础配置，按 IP）
const rateLimitDb = new Map();
app.use(
  ratelimit({
    driver: 'memory',
    db: rateLimitDb,
    duration: 60000,
    errorMessage: '请求过于频繁，请稍后再试',
    id: (ctx) => ctx.ip,
    max: 120,
    disableHeader: false
  })
);

// 7. 解析请求体
app.use(
  bodyParser({
    enableTypes: ['json', 'form', 'text']
  })
);

// 8. 静态资源（上传文件访问）
app.use(serve(path.join(__dirname, '../public')));

// 9. Swagger 文档路由（swagger.json + /docs）
const swaggerRouter = new Router();
swaggerRouter.get('/swagger.json', (ctx) => {
  ctx.body = swaggerSpecs;
});
app.use(swaggerRouter.routes()).use(swaggerRouter.allowedMethods());

app.use(
  koaSwagger({
    routePrefix: '/docs',
    swaggerOptions: { url: '/swagger.json' }
  })
);

// 10. 业务路由注册（核心模块）
app.use(userRouter.routes()).use(userRouter.allowedMethods());
app.use(loginRouter.routes()).use(loginRouter.allowedMethods());
app.use(uploadFileRouter.routes()).use(uploadFileRouter.allowedMethods());
app.use(healthRecordRouter.routes()).use(healthRecordRouter.allowedMethods());
app.use(roomRouter.routes()).use(roomRouter.allowedMethods());

export default app;
