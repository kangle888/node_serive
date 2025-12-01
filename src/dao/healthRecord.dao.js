import knexClient from '../database/knexClient.js';

const TABLE = 'health_record';

class HealthRecordDAO {
  create(payload) {
    return knexClient(TABLE).insert(payload);
  }

  listByUser(userId, page, size) {
    const offset = (page - 1) * size;
    return knexClient(TABLE)
      .select('id', 'type', 'value', 'unit', 'record_time as recordTime', 'createAt')
      .where({ user_id: userId })
      .orderBy('record_time', 'desc')
      .limit(size)
      .offset(offset);
  }
}

export default new HealthRecordDAO();


