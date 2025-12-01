## 健康管理小程序后端服务（Node + Koa）

基于 Koa 的轻量级后端服务，当前主要用于「健康管理」类小程序的后台接口，包括用户注册/登录、文件上传、健康记录等。

---

### 技术栈

- **运行时**：Node.js (建议 >= 18)
- **Web 框架**：Koa 2
- **数据库**：MySQL（mysql2 连接池）
- **认证**：JWT（RS256 非对称加密）
- **其他**：
  - 请求体解析：`koa-bodyparser`
  - CORS：`@koa/cors`
  - 安全：`koa-helmet`、`koa-ratelimit`
  - 日志：`winston`
  - 参数校验：`joi`
  - 文档：`swagger-jsdoc` + `swagger-ui-koa`

---

### 目录结构（核心部分）

- `src/main.js`：应用入口
- `src/app/index.js`：Koa 应用初始化，注册中间件和路由
- `src/config/`
  - `index.js`：端口配置（`SERVER_PORT`）
  - `error.js`：错误枚举常量
  - `screct.js`：JWT 公钥/私钥读取
  - `swagger.js`：Swagger 配置
- `src/middleware/`
  - `login.middleware.js`：登录验证、Token 校验
  - `user.middleware.js`：注册用户相关校验、密码加密
- `src/controller/`：业务控制器
  - `user.controller.js`
  - `login.controller.js`
  - `uploadFile.controller.js`
  - `healthRecord.controller.js`
- `src/service/`：数据库访问 & 业务逻辑
  - `user.service.js`
  - `uploadFile.service.js`
  - `healthRecord.service.js`
- `src/router/`：路由定义
  - `user.router.js`
  - `login.router.js`
  - `uploadFile.router.js`
  - `healthRecord.router.js`
- `src/utils/`
  - `handle-error.js`：统一错误处理
  - `md5-password.js`：密码 MD5 加密
  - `logger.js`：winston 日志
  - `validator.js`：基于 Joi 的参数校验中间件
- `src/public/`：静态资源目录（上传文件）

---

### 环境配置

项目使用 `dotenv-flow`，支持按环境（`.env`, `.env.development`, `.env.production` 等）覆盖配置。所有配置会在 `src/config/index.js` 中集中导出（`appConfig`, `dbConfig`, `jwtConfig`, `uploadConfig`, `logConfig`），业务层不再直接读取环境变量。

最基础的 `.env` 示例：

```bash
SERVER_PORT=10000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=你的密码
DB_NAME=health_manager

LOG_LEVEL=info

JWT_PRIVATE_KEY_PATH=./src/config/keys/private.key
JWT_PUBLIC_KEY_PATH=./src/config/keys/public.key
UPLOAD_BASE_DIR=./src/public/upload
UPLOAD_CHUNK_DIR=./src/public/uploadBigFile
```

> 注意：`src/config/keys/private.key` 和 `public.key` 需要你自行准备（RSA 密钥对），用于 JWT 签名和验证。

---

### 安装与启动

1. 安装依赖：

```bash
npm install
```

2. 启动开发环境（自动重启）：

```bash
npm run dev
```

3. 或启动生产模式：

```bash
npm run start
```

默认服务监听：`http://localhost:10000`（可通过 `.env` 中 `SERVER_PORT` 调整）

---

### 本地 Docker 部署

仓库内提供 `Dockerfile` 和 `docker-compose.yml`，方便本地或服务器直接以容器方式运行。

1. **准备环境变量文件**  
   在项目根目录创建 `.env.docker`（文件名可自定义，需与 `docker-compose.yml` 的 `env_file` 对应）。内容示例：
   ```
   NODE_ENV=production
   SERVER_PORT=10000

   DB_HOST=host.docker.internal   # 容器访问宿主机数据库
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=你的密码
   DB_NAME=health_manager

   LOG_LEVEL=info
   JWT_PRIVATE_KEY_PATH=/app/src/config/keys/private.key
   JWT_PUBLIC_KEY_PATH=/app/src/config/keys/public.key
   UPLOAD_BASE_DIR=/app/src/public/upload
   UPLOAD_CHUNK_DIR=/app/src/public/uploadBigFile
   ```
   > Linux 若数据库不在宿主机，可将 `DB_HOST` 替换为真实地址或容器服务名。

2. **构建镜像**
   ```bash
   docker build -t health-backend .
   ```

3. **使用 docker-compose 启动**
   ```bash
   docker-compose up -d
   ```
   - 会自动映射端口 `${SERVER_PORT}`，并将上传目录挂载到宿主机 `./src/public/upload*`，避免容器清除时文件丢失。
   - 停止/删除：`docker-compose down`

4. **单独运行（不依赖 compose）**
   ```bash
   docker run -d \
     --name health-backend \
     --env-file ./.env.docker \
     -p 10000:10000 \
     -v $(pwd)/src/public/upload:/app/src/public/upload \
     -v $(pwd)/src/public/uploadBigFile:/app/src/public/uploadBigFile \
     health-backend
   ```

部署到服务器时，只需复制 `.env.docker`（或使用真实 `.env.production`）、调整数据库/端口配置，并把上传目录与密钥文件挂载到容器内部路径即可。

---

### 数据库迁移 & DAO

项目集成了 **Knex** 作为查询构建器 + 迁移工具，`src/database/knexClient.js` 管理唯一的数据库连接。所有 SQL 操作拆分为 DAO 层（位于 `src/dao/`，当前包含 `user.dao.js` / `healthRecord.dao.js` / `uploadFile.dao.js`），Service 层仅负责业务聚合。

常用命令：

```bash
# 执行全部迁移（创建/更新表结构）
npm run migrate

# 回滚上一次迁移
npm run migrate:rollback
```

迁移文件位于 `migrations/` 目录，示例 `20251201_init.js` 涵盖了 `user`、`health_record` 等核心表。你可以以此为模板新增自己的数据库变更，所有环境保持一致。

> 如果仍需手写 SQL，可在 DAO 层调用 `knexClient.raw(...)`，统一出口便于测试与维护。

---

### 主要接口概览

详细参数与响应示例请访问 Swagger 文档（见下一节），这里只做简要说明。

- **认证 & 用户**
  - `POST /user`：用户注册（用户名、密码）
  - `POST /login`：用户登录，返回 `token`
  - `GET /login/test`：携带 `Authorization: Bearer <token>` 测试登录状态
  - `GET /user/role`：根据 `userId` 查询角色信息
  - `GET /user/menu`：根据 `roleId` 查询菜单树

- **文件上传**
  - `POST /upload/base64`：上传 base64 图片/文件（需要登录）
    - 参数：`base64`, `filename`
    - 说明：服务器会计算 MD5 去重、写入磁盘，并在 `uploaded_images_files` 表记录元信息。
  - `POST /upload/chunk`：大文件分片上传（需要登录）
  - `POST /upload/merge`：合并分片（需要登录）
  - `POST /upload/verify`：校验已上传分片（需要登录）

- **健康记录（Health）**
  - `POST /healthRecord`：新增健康记录（需要登录）
    - 参数示例：
      ```json
      {
        "type": "bloodPressure",
        "value": 120,
        "unit": "mmHg",
        "recordTime": "2025-01-01T08:00:00.000Z"
      }
      ```
  - `GET /healthRecord?page=&size=`：分页获取当前用户健康记录列表（需要登录）

---

### Swagger 接口文档

项目已集成 Swagger，可通过浏览器查看和在线调试接口：

- 文档地址：`http://localhost:10000/docs`
- 文档来源：`src/router/*.router.js` 中的 `@openapi` 注释

Swagger 支持：

- 查看所有路由分组（Auth、User、Upload、Health）
- 查看请求参数、响应结构
- 在浏览器中直接发起调试请求（需要填写 `Authorize`，即 JWT Token）

---

### 日志与安全

- 请求日志：使用 `winston` 输出到控制台，包含 method、url、status、耗时。
- 安全中间件：
  - `koa-helmet`：基础安全 HTTP 头。
  - `koa-ratelimit`：简单的 IP 级限流防刷。

如需接入生产级监控/日志平台，可以在 `utils/logger.js` 中扩展更多 `transport`（例如写入文件、发往日志服务）。

---

### 小程序对接建议

- 建议在小程序侧统一封装：
  - 请求基地址：`BASE_URL = http://你的服务地址`
  - 自动在请求头携带 `Authorization: Bearer <token>`（登录成功后缓存 token）
  - 对后端统一响应结构 `{ code, message, data }` 做统一处理。
- 典型业务流程：
  1. 注册/登录获取 `token`
  2. 上传头像/报告：调用 `/upload/base64`
  3. 每日打卡：调用 `/healthRecord` 写入记录
  4. 列表页：调用 `GET /healthRecord` 获取历史数据


