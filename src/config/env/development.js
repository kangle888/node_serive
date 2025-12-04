export default {
  log: {
    level: process.env.LOG_LEVEL || 'debug'
  },
   wechat: {
    appid: process.env.WECHAT_APPID || 'wx4adbe79a0790e1c6',
    secret: process.env.WECHAT_SECRET || '68506e2fc25dac31cc043597f2381a36',
    // 微信登录接口地址
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session'
  },
  db: {
    client: 'mysql2',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'xkl789',
    database: process.env.DB_NAME || 'xukangle',
    connectionLimit: Number(process.env.DB_POOL_MAX) || 5
  },
};


