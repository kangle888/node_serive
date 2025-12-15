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

// 2. 安全配置（关闭 CSP）
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

// 3. CORS（正确写法）⚠️ 不要再写手动 OPTIONS 拦截！
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

// 5. 限流
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

// 6. 解析 body（JSON / form），排除文件上传请求
app.use(async (ctx, next) => {
  // 如果是文件上传接口或 multipart 请求，跳过 bodyParser
  const isMultipart = ctx.headers['content-type']?.includes(
    'multipart/form-data'
  );
  if (
    ctx.path === '/api/upload/file' ||
    ctx.path.startsWith('/api/upload/chunk') ||
    (ctx.path === '/api/user/profile' && isMultipart) ||
    isMultipart
  ) {
    await next();
  } else {
    // 其他请求使用 bodyParser
    return bodyParser({
      enableTypes: ['json', 'form', 'text']
    })(ctx, next);
  }
});

// 7. 静态资源（上传文件）
app.use(serve(path.join(__dirname, '../public')));

// 8. Swagger 文档
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

// 9. 创建 API 主路由，统一添加 /api 前缀
const apiRouter = new Router({ prefix: '/api' });

// 将所有业务路由挂载到 /api 下
apiRouter.use(userRouter.routes()).use(userRouter.allowedMethods());
apiRouter.use(loginRouter.routes()).use(loginRouter.allowedMethods());
apiRouter
  .use(healthRecordRouter.routes())
  .use(healthRecordRouter.allowedMethods());
apiRouter.use(roomRouter.routes()).use(roomRouter.allowedMethods());

// 注册 API 路由（顺序必须在最后）
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());

export default app;
