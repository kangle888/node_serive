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

  // 根据用户id获取用户信息
  async getUserInfo(userId) {
    console.log('userId--------------------:', userId);
    const statement = `
        SELECT 
          user.id, 
          user.name, 
          user.createAt,
          JSON_OBJECT('userId', user.id, 'username', user.name) AS USER,
          JSON_ARRAYAGG(JSON_OBJECT('roleId', roles.id, 'roleName', roles.role_name)) AS roles
        FROM 
          USER
        LEFT JOIN 
          user_roles ON user.id = user_roles.user_id
        LEFT JOIN 
          roles ON user_roles.role_id = roles.id
        WHERE 
          user.id = ?
        GROUP BY 
          user.id;
    `;
    try {
      const [data] = await connection.execute(statement, [userId]);
      console.log('data:////////////', data);
      return data;
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error('Error retrieving user information');
    }
  }
}

export default new UserService();
