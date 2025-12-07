import RoomService from '../service/room.service.js';
import WechatService from '../service/wechat.service.js';
import RoomDAO from '../dao/room.dao.js';

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

  /**
   * 生成房间小程序码
   * 用于分享房间，扫描后可直接跳转到小程序并自动加入房间
   */
  async generateQRCode(ctx) {
    const { inviteCode } = ctx.request.body;

    if (!inviteCode) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '邀请码不能为空'
      };
      return;
    }

    // 验证邀请码格式（8位字母数字）
    const code = String(inviteCode).trim().toUpperCase();
    if (code.length !== 8 || !/^[A-Z0-9]{8}$/.test(code)) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '邀请码格式不正确'
      };
      return;
    }

    try {
      // 验证房间是否存在
      const room = await RoomDAO.findByInviteCode(code);
      if (!room) {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: '房间不存在'
        };
        return;
      }

      // 生成小程序码
      // scene 参数：邀请码（最大32字符，只能是可见字符）
      // page 参数：明确传递首页路径（pages/index/index 是 tabBar 页面，应该存在）
      // 注意：如果小程序未发布，生成小程序码可能会失败
      console.log('准备生成小程序码，邀请码:', code, '长度:', code.length);

      const qrCodeBase64 = await WechatService.getUnlimitedQRCode({
        scene: code, // 使用验证后的邀请码
        page: 'pages/index/index', // 明确传递首页路径
        width: 430,
        autoColor: false,
        lineColor: { r: 39, g: 186, b: 155 }, // 主题色
        isHyaline: false
      });

      ctx.body = {
        code: 200,
        message: '生成成功',
        data: {
          qrCode: qrCodeBase64,
          inviteCode: inviteCode
        }
      };
    } catch (error) {
      console.error('生成小程序码失败:', error);

      // 检查是否是微信 API 的 40066 错误（invalid url）
      let errorMessage = error.message || '生成小程序码失败';
      if (
        errorMessage.includes('40066') ||
        errorMessage.includes('invalid url')
      ) {
        errorMessage =
          '生成小程序码失败：小程序可能未发布或页面路径配置不正确。请确保小程序已发布（至少体验版），并且页面路径 "pages/index/index" 已正确配置。';
      }

      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: errorMessage
      };
    }
  }
}

export default new RoomController();
