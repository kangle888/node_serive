import connection from '../app/database.js';

class UserService {
  async create(user) {
    // 1 获取用户数据
    const { username, password } = user;
    // 2 拼接statrment
    const statement = `INSERT INTO user (name, password) VALUES (?, ?);`;
    // 3 执行sql
    const result = await connection.execute(statement, [username, password]);
    // 4 返回结果
    return result;
  }

  // 查询用户
  async getUserByName(username) {
    const statement = `SELECT * FROM user WHERE name = ?;`;
    const values = await connection.execute(statement, [username]);
    return values;
  }
}

export default new UserService();
