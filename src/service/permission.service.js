import connection from '../app/database.js';

class PermissionService {
  async checkMoment(momentId, userId) {
    const statement = `SELECT * FROM moment WHERE id = ? AND user_id = ?;`;
    const [result] = await connection.execute(statement, [momentId, userId]);
    const exists = Array.isArray(result) && result.length > 0;
    return exists;
  }
  // 通用的中间建权限封装
  async checkResource(tableName, resourceId, id) {
    const statement = `SELECT * FROM ${tableName} WHERE id = ? AND user_id = ?;`;
    const [result] = await connection.execute(statement, [resourceId, id]);
    const exists = Array.isArray(result) && result.length > 0;
    return exists;
  }
}

export default new PermissionService();
