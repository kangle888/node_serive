import connection from '../app/database.js';

class HealthRecordService {
  async upsert(userId, payload) {
    const { type, value, unit, recordTime } = payload;
    const statement = `
      INSERT INTO health_record (user_id, type, value, unit, record_time)
      VALUES (?, ?, ?, ?, ?);
    `;
    const [result] = await connection.execute(statement, [userId, type, value, unit || '', recordTime]);
    return result;
  }

  async list(userId, page = 1, size = 10) {
    const offset = (page - 1) * size;
    const statement = `
      SELECT id, type, value, unit, record_time AS recordTime, createAt
      FROM health_record
      WHERE user_id = ?
      ORDER BY record_time DESC
      LIMIT ? OFFSET ?;
    `;
    const [rows] = await connection.execute(statement, [userId, size, offset]);
    return rows;
  }
}

export default new HealthRecordService();


