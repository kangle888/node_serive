import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// 创建连接池，使用环境变量配置，便于不同环境（开发/测试/生产）切换
const connectionPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'xkl789',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'xukangle',
  connectionLimit: 5
});

// 检查数据库连接
connectionPool.getConnection((err, connection) => {
  if (err) {
    console.log('数据库连接失败', err);
    return;
  }
  connection.connect((err) => {
    if (err) {
      console.log('和数据库交互失败', err);
      return;
    }
    console.log('数据库连接成功');
  });
});

// 从连接池中获取 promise 风格的连接
const connection = connectionPool.promise();

export default connection;
