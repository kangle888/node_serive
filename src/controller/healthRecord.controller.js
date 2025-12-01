import HealthRecordService from '../service/healthRecord.service.js';

class HealthRecordController {
  // 新增或更新健康记录
  async upsert(ctx) {
    const { id: userId } = ctx.user;
    const payload = ctx.request.body;
    const result = await HealthRecordService.upsert(userId, payload);
    ctx.body = {
      code: 200,
      message: '保存健康记录成功',
      data: result
    };
  }

  // 查询当前登录用户的健康记录列表
  async list(ctx) {
    const { id: userId } = ctx.user;
    const { page = 1, size = 10 } = ctx.query;
    const data = await HealthRecordService.list(userId, Number(page), Number(size));
    ctx.body = {
      code: 200,
      message: '获取健康记录成功',
      data
    };
  }
}

export default new HealthRecordController();


