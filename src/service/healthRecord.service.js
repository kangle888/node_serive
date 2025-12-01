import HealthRecordDAO from '../dao/healthRecord.dao.js';

class HealthRecordService {
  async upsert(userId, payload) {
    const record = {
      user_id: userId,
      type: payload.type,
      value: payload.value,
      unit: payload.unit || '',
      record_time: payload.recordTime
    };
    return HealthRecordDAO.create(record);
  }

  async list(userId, page = 1, size = 10) {
    return HealthRecordDAO.listByUser(userId, page, size);
  }
}

export default new HealthRecordService();


