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
    const statement = `
        SELECT 
          user.id, 
          user.name, 
          user.createAt,
          JSON_OBJECT('userId', user.id, 'username', user.name) AS user,
          JSON_ARRAYAGG(JSON_OBJECT('id', roles.id, 'roleName', roles.role_name)) AS role
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
      return data;
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error('Error retrieving user information');
    }
  }

  // 根据角色id获取菜单信息
  async getMenuInfo(roleId) {
    const statement = `
          SELECT 
          m.id,
          m.name,
          m.type,
          m.url,
          m.icon,
          m.sort,
          m.parent_id,
          JSON_ARRAYAGG(
              JSON_OBJECT(
                  'id', m_child.id,
                  'name', m_child.name,
                  'type', m_child.type,
                  'url', m_child.url,
                  'icon', m_child.icon,
                  'sort', m_child.sort,
                  'parent_id', m_child.parent_id
              )
          ) AS children
      FROM 
          roles r
      JOIN 
          roles_menu rm ON r.id = rm.role_id
      JOIN 
          menu m ON rm.menu_id = m.id
      LEFT JOIN 
          menu m_child ON m.id = m_child.parent_id
      WHERE 
          r.id = ?  -- 指定角色 ID
          AND m.parent_id IS NULL  -- 只查询顶层菜单
      GROUP BY 
          m.id
      ORDER BY 
          m.sort;
    `;
    try {
      const [data] = await connection.execute(statement, [roleId]);
      return data;
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error('Error retrieving menu information');
    }
  }
}

export default new UserService();
