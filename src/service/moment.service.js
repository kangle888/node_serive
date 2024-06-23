import connection from '../app/database.js';

class MomentService {
  async create(content, id) {
    const statement = `INSERT INTO moment (content, user_id) VALUES (?, ?);`;
    const result = await connection.execute(statement, [content, id]);
    return result;
  }

  // 查询数据库中的动态列表
  async getMomentList(offset = 0, size = 10) {
    const statement = `SELECT 
    m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
    JSON_OBJECT('id', u.id, 'name', u.name, 'createTime', u.createAt, 'updateTime', u.updateAt) USER
  FROM moment m
  LEFT JOIN USER u ON m.user_id = u.id
  GROUP BY m.id
  LIMIT ? OFFSET ?;`;
    console.log('offset', offset, 'size', size);
    const [result] = await connection.execute(statement, [size, offset]);
    return result;
  }

  // 查询数据库中的动态详情
  async getMomentById(momentId) {
    const statement = `SELECT 
    m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
    JSON_OBJECT('id', u.id, 'name', u.name) USER
  FROM moment m
  LEFT JOIN USER u ON m.user_id = u.id
  WHERE m.id = ?;`;
    const [result] = await connection.execute(statement, [momentId]);
    return result;
  }

  // 修改数据库中的动态
  async update(content, momentId) {
    const statement = `UPDATE moment SET content = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [content, momentId]);
    return result;
  }

  /**
   * 删除动态
   */
  async remove(momentId) {
    const statement = `DELETE FROM moment WHERE id = ?;`;
    const [result] = await connection.execute(statement, [momentId]);
    return result;
  }
}

export default new MomentService();
