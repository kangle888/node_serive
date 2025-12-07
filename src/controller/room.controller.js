import RoomService from '../service/room.service.js';
import WechatService from '../service/wechat.service.js';
import RoomDAO from '../dao/room.dao.js';

class RoomController {
  async create (ctx) {
    const { name } = ctx.request.body;
    const userId = ctx.user.id;
    const room = await RoomService.createRoom({ name, creatorId: userId });
    ctx.body = {
      code: 200,
      message: '房间创建成功',
      data: room
    };
  }

  async join (ctx) {
    const { inviteCode } = ctx.request.body;
    const userId = ctx.user.id;
    const member = await RoomService.joinRoom({ inviteCode, userId });
    ctx.body = {
      code: 200,
      message: '加入房间成功',
      data: member
    };
  }

  async list (ctx) {
    const userId = ctx.user.id;
    const rooms = await RoomService.listUserRooms(userId);
    ctx.body = {
      code: 200,
      message: 'success',
      data: rooms
    };
  }

  async detail (ctx) {
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

  async transfer (ctx) {
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
  async generateQRCode (ctx) {
    const { inviteCode } = ctx.request.body;

    if (!inviteCode) {
      ctx.status = 400;
      ctx.body = { code: 400, message: '邀请码不能为空' };
      return;
    }

    // 验证邀请码格式（8位字母数字）
    const code = String(inviteCode).trim().toUpperCase();
    if (code.length !== 8 || !/^[A-Z0-9]{8}$/.test(code)) {
      ctx.status = 400;
      ctx.body = { code: 400, message: '邀请码格式不正确' };
      return;
    }

    try {
      // 验证房间是否存在
      const room = await RoomDAO.findByInviteCode(code);
      if (!room) {
        ctx.status = 404;
        ctx.body = { code: 404, message: '房间不存在' };
        return;
      }

      console.log('准备生成小程序码，邀请码:', code, '长度:', code.length);

      // 生成小程序码
      const qrCodeBase64 = await WechatService.getUnlimitedQRCode({
        scene: code,
        // 默认不传 page，让微信使用默认首页，避免 uni-app 编译路径问题
        page: 'pages/index/index',
        width: 430,
        autoColor: false,
        lineColor: { r: 39, g: 186, b: 155 },
        isHyaline: false,
        useWxacodeUnlimit: true // 体验版接口
      });

      ctx.body = {
        code: 200,
        message: '生成成功',
        data: { qrCode: qrCodeBase64, inviteCode: code }
      };
    } catch (error) {
      console.error('生成小程序码失败:', error);

      let errorMessage = error.message || '生成小程序码失败';
      if (errorMessage.includes('40066') || errorMessage.includes('invalid url')) {
        errorMessage = `生成小程序码失败：${error.message}。可能原因：1) 小程序刚发布，需要等待几分钟让微信服务器同步；2) 页面路径配置问题；3) AppID/Secret 配置不正确。请稍后重试或检查配置。`;
      }

      ctx.status = 500;
      ctx.body = { code: 500, message: errorMessage };
    }
  }

  // 测试微信 access_token 获取（用于调试）
  async testWechatToken (ctx) {
    try {
      const WechatService = (await import('../service/wechat.service.js'))
        .default;
      const token = await WechatService.getAccessToken();
      ctx.body = {
        code: 200,
        message: 'success',
        data: {
          token: token ? `${token.substring(0, 20)}...` : 'null',
          tokenLength: token ? token.length : 0
        }
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message || '获取 access_token 失败'
      };
    }
  }
}

export default new RoomController();
