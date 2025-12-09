import UserDAO from '../dao/user.dao.js';

class UserService {
  async create(user) {
    return UserDAO.create(user);
  }

  async getUserByName(username) {
    return UserDAO.findByName(username);
  }

  /**
   * 根据 openid 查找或创建微信用户
   * @param {string} openid - 微信 openid
   * @param {Object} userInfo - 微信用户信息（可选）
   * @param {string} userInfo.unionid - 微信 unionid
   * @param {string} userInfo.nickname - 昵称
   * @param {string} userInfo.avatar_url - 头像URL
   */
  async findOrCreateWechatUser(openid, userInfo = {}) {
    // 先查找用户
    let user = await UserDAO.findByOpenid(openid);
    
    if (!user) {
      // 用户不存在，创建新用户
      const [insertId] = await UserDAO.createWechatUser({
        openid,
        unionid: userInfo.unionid,
        nickname: userInfo.nickname,
        avatar_url: userInfo.avatar_url
      });
      user = await UserDAO.findById(insertId);
    } else {
      // 用户存在，更新用户信息（如果有新信息）
      if (userInfo.nickname || userInfo.avatar_url || userInfo.unionid) {
        await UserDAO.updateWechatUser(user.id, {
          nickname: userInfo.nickname,
          avatar_url: userInfo.avatar_url,
          unionid: userInfo.unionid
        });
        // 重新获取用户信息
        user = await UserDAO.findById(user.id);
      }
    }
    
    return user;
  }

  /**
   * 根据用户ID获取用户信息
   * @param {number} userId - 用户ID
   */
  async getUserById(userId) {
    return UserDAO.findById(userId);
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

  async updateProfile(userId, payload) {
    await UserDAO.updateWechatUser(userId, {
      nickname: payload.nickname,
      avatar_url: payload.avatar_url,
      name: payload.username,
      phone: payload.phone
    });
    return UserDAO.findById(userId);
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

