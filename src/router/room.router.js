import KoaRouter from '@koa/router';
import Joi from 'joi';
import RoomController from '../controller/room.controller.js';
import { verifyAuth } from '../middleware/login.middleware.js';
import { validate } from '../utils/validator.js';

export const roomRouter = new KoaRouter({ prefix: '/rooms' });

const createRoomSchema = Joi.object({
  name: Joi.string().min(2).max(50).required()
});

const joinRoomSchema = Joi.object({
  inviteCode: Joi.string().alphanum().length(8).required()
});

const transferSchema = Joi.object({
  fromMemberId: Joi.string().uuid().required(),
  toMemberId: Joi.string().uuid().required(),
  amount: Joi.number().positive().precision(2).required(),
  remark: Joi.string().max(255).allow('', null)
});

// 注意：具体路由要放在动态路由之前，避免被 :roomId 匹配
roomRouter.post(
  '/',
  verifyAuth,
  validate(createRoomSchema),
  RoomController.create
);
roomRouter.post(
  '/join',
  verifyAuth,
  validate(joinRoomSchema),
  RoomController.join
);

// 生成房间小程序码（必须在 /:roomId 之前）
const qrCodeSchema = Joi.object({
  inviteCode: Joi.string().alphanum().length(8).required()
});
roomRouter.post(
  '/qr',
  validate(qrCodeSchema),
  RoomController.generateQRCode
);

// 测试微信 access_token 获取（用于调试）
roomRouter.get(
  '/test-wechat-token',
  verifyAuth,
  RoomController.testWechatToken
);

roomRouter.get('/', verifyAuth, RoomController.list);
roomRouter.get('/:roomId', verifyAuth, RoomController.detail);
roomRouter.post(
  '/:roomId/transfer',
  verifyAuth,
  validate(transferSchema),
  RoomController.transfer
);
roomRouter.delete('/:roomId', verifyAuth, RoomController.remove);
roomRouter.delete('/:roomId/leave', verifyAuth, RoomController.leave);

