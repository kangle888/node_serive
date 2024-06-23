import MomentService from '../service/moment.service.js';

class MomentController {
  async create(ctx, next) {
    const { content } = ctx.request.body;
    const { id } = ctx.user;
    const result = await MomentService.create(content, id);
    console.log('创建动态成功, 内容是', content, '用户是', id);
    ctx.body = {
      code: 0,
      message: '创建动态成功',
      data: result
    };
  }

  // 获取动态列表
  async list(ctx, next) {
    // 获取offset, size
    const { offset, size } = ctx.query;

    const result = await MomentService.getMomentList(offset, size);
    ctx.body = {
      code: 0,
      message: '查询动态列表成功',
      data: result
    };
  }

  // 获取动态详情
  async detail(ctx, next) {
    const { momentId } = ctx.params;
    const result = await MomentService.getMomentById(momentId);
    ctx.body = {
      code: 0,
      message: '查询动态详情成功',
      data: result
    };
  }

  /**
   * 修改动态
   * 只有登录用户才能修改自己的动态
   */
  async update(ctx, next) {
    const { momentId } = ctx.params;
    const { content } = ctx.request.body;
    const result = await MomentService.update(content, momentId);
    ctx.body = {
      code: 0,
      message: '修改动态成功',
      data: result
    };
  }

  /**
   * 删除动态
   */
  async remove(ctx, next) {
    const { momentId } = ctx.params;
    const result = await MomentService.remove(momentId);
    ctx.body = {
      code: 0,
      message: '删除动态成功',
      data: result
    };
  }
}

export default new MomentController();
