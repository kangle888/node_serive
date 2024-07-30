import mysql from 'mysql2';

// 创建连接池
const connectionPool = mysql.createPool({
  host: '106.14.97.130',
  user: 'root',
  password: 'XUkang789.',
  port: 3306,
  database: 'codeerhub',
  connectionLimit: 5
});

// 2 链接是否成功
connectionPool.getConnection((err, connection) => {
  if (err) {
    console.log('数据库连接失败', err);
    return;
  }
  // 连接成功
  connection.connect((err) => {
    if (err) {
      console.log('和数据库交互失败', err);
      return;
    }
    console.log('连接成功，可以进行数据库交互了');
  });
});

// 3 从连接池中获取连接
const connection = connectionPool.promise();

export default connection;
