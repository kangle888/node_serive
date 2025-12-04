import knexClient from '../database/knexClient.js';

const USER_LOGIN_LOG_TABLE = 'user_login_log';

class UserLoginLogDAO {
  /**
   * 创建登录日志
   * @param {Object} logData - 登录日志数据
   * @param {number} logData.user_id - 用户ID
   * @param {string} logData.login_ip - 登录IP
   * @param {string} logData.login_method - 登录方式
   * @param {boolean} logData.success - 是否成功
   */
  create(logData) {
    return knexClient(USER_LOGIN_LOG_TABLE).insert({
      user_id: logData.user_id,
      login_ip: logData.login_ip,
      login_method: logData.login_method || 'wechat',
      success: logData.success !== undefined ? logData.success : 1
    });
  }

  /**
   * 根据用户ID获取登录日志列表
   * @param {number} userId - 用户ID
   * @param {number} limit - 限制条数
   */
  getByUserId(userId, limit = 10) {
    return knexClient(USER_LOGIN_LOG_TABLE)
      .where({ user_id: userId })
      .orderBy('login_time', 'desc')
      .limit(limit);
  }
}

export default new UserLoginLogDAO();

