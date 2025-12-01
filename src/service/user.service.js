import UserDAO from '../dao/user.dao.js';

class UserService {
  async create(user) {
    return UserDAO.create(user);
  }

  async getUserByName(username) {
    return UserDAO.findByName(username);
  }

  // 根据用户id获取用户信息
  async getUserInfo(userId) {
    const [rows] = await UserDAO.getUserInfo(userId);
    return rows;
  }
  // 根据roleId获取用户菜单信息
  async getUserMenu(roleId) {
    const [rows] = await UserDAO.getUserMenu(roleId);
    return buildTree(rows);
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

