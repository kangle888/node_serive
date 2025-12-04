import RoomService from '../service/room.service.js';

class RoomController {
  async create(ctx) {
    const { name } = ctx.request.body;
    const userId = ctx.user.id;
    const room = await RoomService.createRoom({ name, creatorId: userId });
    ctx.body = {
      code: 200,
      message: '房间创建成功',
      data: room
    };
  }

  async join(ctx) {
    const { inviteCode } = ctx.request.body;
    const userId = ctx.user.id;
    const member = await RoomService.joinRoom({ inviteCode, userId });
    ctx.body = {
      code: 200,
      message: '加入房间成功',
      data: member
    };
  }

  async list(ctx) {
    const userId = ctx.user.id;
    const rooms = await RoomService.listUserRooms(userId);
    ctx.body = {
      code: 200,
      message: 'success',
      data: rooms
    };
  }

  async detail(ctx) {
    const { roomId } = ctx.params;
    const detail = await RoomService.getRoomDetail(roomId);
    if (!detail) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '房间不存在' };
      return;
    }
    ctx.body = {
      code: 200,
      message: 'success',
      data: detail
    };
  }

  async transfer(ctx) {
    const { roomId } = ctx.params;
    const { fromMemberId, toMemberId, amount, remark } = ctx.request.body;
    const transaction = await RoomService.recordTransfer({
      roomId,
      fromMemberId,
      toMemberId,
      amount,
      remark
    });
    ctx.body = {
      code: 200,
      message: '转账成功',
      data: transaction
    };
  }
}

export default new RoomController();


