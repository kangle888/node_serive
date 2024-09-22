import CommentService from '../service/comment.service.js';
class commentController {
  async create(ctx, next) {
    const { momentId, content } = ctx.request.body;
    const { id } = ctx.user;
    // 操作数据库
    const result = await CommentService.create(momentId, content, id);
    ctx.body = {
      status: 200,
      message: '评论成功',
      data: result
    };
  }
  /**
   * 回复评论
   * @param {*} ctx
   * @param {*} next
   */
  async reply(ctx, next) {
    const { momentId, content, commentId } = ctx.request.body;
    const { id } = ctx.user;
    // 操作数据库
    const result = await CommentService.reply(momentId, content, id, commentId);
    ctx.body = {
      status: 200,
      message: '回复评论成功',
      data: result
    };
  }
}

export default new commentController();
