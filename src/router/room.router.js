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

roomRouter.post('/', verifyAuth, validate(createRoomSchema), RoomController.create);
roomRouter.post('/join', verifyAuth, validate(joinRoomSchema), RoomController.join);
roomRouter.get('/', verifyAuth, RoomController.list);
roomRouter.get('/:roomId', verifyAuth, RoomController.detail);
roomRouter.post(
  '/:roomId/transfer',
  verifyAuth,
  validate(transferSchema),
  RoomController.transfer
);


