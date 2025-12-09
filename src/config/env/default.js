import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcRoot = path.resolve(__dirname, '../..');
const projectRoot = path.resolve(srcRoot, '..');
const publicDir = path.join(srcRoot, 'public');

export default {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.SERVER_PORT) || 10000
  },
  db: {
    client: 'mysql2',
    host: process.env.DB_HOST || '119.45.128.43',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'XUkang789.',
    database: process.env.DB_NAME || 'BookKeeping',
    connectionLimit: Number(process.env.DB_POOL_MAX) || 5
  },
  jwt: {
    privateKeyPath:
      process.env.JWT_PRIVATE_KEY_PATH || path.join(__dirname, '../keys/private.key'),
    publicKeyPath:
      process.env.JWT_PUBLIC_KEY_PATH || path.join(__dirname, '../keys/public.key'),
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    algorithm: 'RS256'
  },
  upload: {
    baseDir: process.env.UPLOAD_BASE_DIR || path.join(publicDir, 'upload'),
    chunkDir: process.env.UPLOAD_CHUNK_DIR || path.join(publicDir, 'uploadBigFile'),
    tempDir: process.env.UPLOAD_TEMP_DIR || path.join(projectRoot, 'tmp')
  },
  log: {
    level: process.env.LOG_LEVEL || 'info'
  },
  wechat: {
    appid: process.env.WECHAT_APPID || 'wx4adbe79a0790e1c6',
    secret: process.env.WECHAT_SECRET || '68506e2fc25dac31cc043597f2381a36',
    // 微信登录接口地址
    loginUrl: 'https://api.weixin.qq.com/sns/jscode2session',
    // 小程序码默认配置，可用环境变量覆盖
    qrPage: process.env.WECHAT_QR_PAGE || 'pages/index/index',
    qrEnvVersion: process.env.WECHAT_QR_ENV || 'trial', // trial/release/develop
    qrWidth: Number(process.env.WECHAT_QR_WIDTH) || 430,
    qrCheckPath: process.env.WECHAT_QR_CHECK_PATH
      ? process.env.WECHAT_QR_CHECK_PATH === 'true'
      : false,
    qrHyaline: process.env.WECHAT_QR_HYALINE === 'true'
  }
};


