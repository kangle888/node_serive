# 微信小程序登录配置说明

## 后端配置

### 1. 环境变量配置

在 `node_serive` 目录下创建或修改 `.env` 或 `.env.development` 文件，添加以下配置：

```env
# 微信小程序配置
WECHAT_APPID=你的微信小程序AppID
WECHAT_SECRET=你的微信小程序AppSecret
```

### 2. 数据库表

确保数据库中已经创建了以下两张表：

- `user` - 用户主表
- `user_login_log` - 登录日志表

表结构请参考项目中的 `sql.sql` 文件。

### 3. 启动后端服务

```bash
cd node_serive
npm install
npm run dev
```

后端服务默认运行在 `http://localhost:10000`

## 前端配置

### 1. 修改 API 地址

在 `uni-app-project/src/utils/http.ts` 中，根据实际情况修改 `baseURL`：

```typescript
const baseURL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:10000'  // 开发环境后端地址
  : 'https://your-production-api.com'  // 生产环境后端地址
```

### 2. 微信小程序配置

在微信开发者工具中：

1. 设置 AppID（使用你的微信小程序 AppID）
2. 在 `manifest.json` 中配置小程序相关设置
3. 确保已开通微信登录功能

### 3. 启动前端项目

```bash
cd uni-app-project
npm install
npm run dev:mp-weixin
```

## 登录流程说明

1. **前端**：用户点击"微信快速登录"按钮
2. **前端**：调用 `uni.login()` 获取 `code`
3. **前端**：调用 `uni.getUserInfo()` 获取用户信息（可选）
4. **前端**：将 `code` 和 `userInfo` 发送到后端 `/login/wechat` 接口
5. **后端**：使用 `code` 调用微信接口获取 `openid`
6. **后端**：根据 `openid` 查找或创建用户
7. **后端**：生成 JWT token 并返回
8. **前端**：保存 token 和用户信息到 store
9. **前端**：跳转到首页

## API 接口说明

### POST /login/wechat

**请求参数：**
```json
{
  "code": "微信登录凭证",
  "userInfo": {
    "nickName": "用户昵称",
    "avatarUrl": "头像URL",
    "gender": 1,
    "country": "国家",
    "province": "省份",
    "city": "城市"
  }
}
```

**响应数据：**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "id": 1,
    "openid": "微信openid",
    "nickname": "用户昵称",
    "avatar_url": "头像URL",
    "phone": null,
    "token": "JWT token"
  }
}
```

## 注意事项

1. **微信 AppID 和 AppSecret**：需要在微信公众平台获取，并妥善保管
2. **HTTPS**：生产环境必须使用 HTTPS
3. **Token 存储**：前端使用 Pinia 持久化存储 token
4. **登录日志**：每次登录都会记录到 `user_login_log` 表
5. **用户状态**：只有 `status = 1` 的用户才能登录

## 常见问题

### 1. 获取 openid 失败

- 检查 AppID 和 AppSecret 是否正确
- 检查网络连接
- 查看后端日志错误信息

### 2. 登录后跳转失败

- 检查 `pages.json` 中首页路径是否正确
- 确保首页在 tabBar 中配置

### 3. Token 验证失败

- 检查 JWT 密钥文件是否存在
- 检查 token 是否过期
- 检查请求头中 Authorization 格式是否正确

