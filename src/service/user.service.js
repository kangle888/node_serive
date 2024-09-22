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
          JSON_ARRAYAGG(JSON_OBJECT('roleId', roles.id, 'roleName', roles.role_name)) AS roles
        FROM 
          user
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
  // 根据roleId获取用户菜单信息
  async getUserMenu(roleId) {
    const statement = `
        SELECT 
          menu.id, 
          menu.type, 
          menu.url, 
          menu.icon, 
          menu.parent_id,
          menu.name
        FROM 
          menu
        LEFT JOIN 
          role_menu ON menu.id = role_menu.menu_id
        LEFT JOIN 
          roles ON role_menu.role_id = roles.id
        WHERE 
          roles.id = ?;
      `;
    try {
      const [data] = await connection.execute(statement, [roleId]);
      console.log('data', data);
      const treeData = buildTree(data);
      // console.log('treeData-----', treeData);
      return treeData;
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error('Error retrieving user menu information');
    }
  }
}

export default new UserService();


// 将数据转换为树状结构
function buildTree(data) {
  const map = new Map();
  const roots = [];

  // 先将所有节点存储到 Map 中，以 ID 为键，确保每个节点都有 children 数组
  data.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  // 然后遍历数据，根据 parent_id 构建父子关系
  data.forEach(item => {
    const node = map.get(item.id);
    if (item.parent_id === null) {
      // 没有 parent_id 的节点是根节点，直接添加到 roots 数组中
      roots.push(node);
    } else {
      // 如果有 parent_id，将该节点添加到对应父节点的 children 数组中
      const parentNode = map.get(item.parent_id);
      if (parentNode) {
        parentNode.children.push(node);
      }
    }
  });

  return roots;
}

