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
  // 获取用户列表 根据query参数 offset 和 size
  async getUserList(offset, size) {
    console.log('Offset:', offset, 'Type:', typeof offset);
    console.log('Size:', size, 'Type:', typeof size);
    // 计算偏移量和限制数量
    const page = (offset - 1) * size;
    const pageSize = size;

    // 调整查询语句，正确使用准备语句的参数
    const listQuery = `
        SELECT * FROM user_list
        OFFSET ? ROWS
        FETCH NEXT ? ROWS ONLY
    `;
    const countQuery = `SELECT COUNT(*) as total FROM user_list`;
    console.log('Executing query:', listQuery, [offset, size]);
    try {
      // 使用正确格式的参数执行查询
      const [listData] = await connection.execute(listQuery, [parseInt(page), parseInt(pageSize)]);
      const [countData] = await connection.execute(countQuery);

      // 从 countData 中获取总记录数
      const total = countData[0].total;

      return {
        list: listData,
        total: total
      };
    } catch (error) {
      console.error('执行查询时出错:', error);
      throw new Error('获取用户列表时出错');
    }
  }




  // 获取查询用户列表
  async searchUserList(userReq) {
    const { username, realname, phone, status, start_date, end_date } = userReq;
    // 构建查询条件
    let statement = `SELECT * FROM user_list WHERE 1=1`;
    const params = [];

    if (username) {
      statement += ` AND username = ?`;
      params.push(username);
    }

    if (realname) {
      statement += ` AND realname = ?`;
      params.push(realname);
    }

    if (phone) {
      statement += ` AND phone = ?`;
      params.push(phone);
    }

    if (status) {
      statement += ` AND status = ?`;
      params.push(status);
    }

    if (start_date) {
      statement += ` AND created_at >= ?`;
      params.push(start_date);
    }

    if (end_date) {
      statement += ` AND created_at <= ?`;
      params.push(end_date);
    }
    try {
      const [data] = await connection.execute(statement, params);
      return data;
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error('Error retrieving user list');
    }
  }
  // 新增用户
  async addUser(userReq) {
    const { username, realname, phone, status } = userReq;
    const statement = `INSERT INTO user_list (username, realname, phone, status, created_at, updated_at) VALUES (?, ?, ?, ?,?, ?);`;

    const created_at = new Date(); // 获取当前时间作为创建时间
    const updated_at = new Date(); // 获取当前时间作为更新时间
    const values = [username, realname, phone, status, created_at, updated_at];
    try {
      const [data] = await connection.execute(statement, values);
      return data;
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error('Error adding user');
    }
  }
  // 删除用户
  async deleteUser(userReq) {
    const { id } = userReq;
    const statement = `DELETE FROM user_list WHERE id = ?;`;
    try {
      const [data] = await connection.execute(statement, [id]);
      return data;
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error('Error deleting user');
    }
  }
}

export default new UserService();
