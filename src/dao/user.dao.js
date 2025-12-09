import knexClient from '../database/knexClient.js';

const USER_TABLE = 'user';

class UserDAO {
  create(user) {
    return knexClient(USER_TABLE).insert({ name: user.username, password: user.password });
  }

  findByName(username) {
    return knexClient(USER_TABLE).where({ name: username }).first();
  }

  /**
   * 根据 openid 查找用户
   * @param {string} openid - 微信 openid
   */
  findByOpenid(openid) {
    return knexClient(USER_TABLE).where({ openid }).first();
  }

  /**
   * 创建微信用户
   * @param {Object} userData - 用户数据
   * @param {string} userData.openid - 微信 openid
   * @param {string} userData.unionid - 微信 unionid（可选）
   * @param {string} userData.nickname - 昵称（可选）
   * @param {string} userData.avatar_url - 头像URL（可选）
   */
  createWechatUser(userData) {
    return knexClient(USER_TABLE).insert({
      openid: userData.openid,
      unionid: userData.unionid || null,
      nickname: userData.nickname || null,
      avatar_url: userData.avatar_url || null,
      status: 1
    });
  }

  /**
   * 更新微信用户信息
   * @param {number} userId - 用户ID
   * @param {Object} userData - 要更新的用户数据
   */
  updateWechatUser(userId, userData) {
    const updateData = {};
    if (userData.unionid !== undefined) updateData.unionid = userData.unionid;
    if (userData.nickname !== undefined) updateData.nickname = userData.nickname;
    if (userData.avatar_url !== undefined) updateData.avatar_url = userData.avatar_url;
    if (userData.name !== undefined) updateData.name = userData.name;
    if (userData.phone !== undefined) updateData.phone = userData.phone;

    return knexClient(USER_TABLE)
      .where({ id: userId })
      .update(updateData);
  }

  /**
   * 根据用户ID获取用户基本信息
   * @param {number} userId - 用户ID
   */
  findById(userId) {
    return knexClient(USER_TABLE).where({ id: userId }).first();
  }

  /**
   * 批量根据用户ID获取用户信息
   * @param {number[]} userIds - 用户ID数组
   */
  findByIds(userIds) {
    if (!userIds?.length) return Promise.resolve([]);
    return knexClient(USER_TABLE).whereIn('id', userIds);
  }

  getUserInfo(userId) {
    return knexClient.raw(
      `
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
      `,
      [userId]
    );
  }

  getUserMenu(roleId) {
    return knexClient.raw(
      `
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
      `,
      [roleId]
    );
  }
}

export default new UserDAO();


