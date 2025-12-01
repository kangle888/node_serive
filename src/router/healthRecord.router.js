import KoaRouter from '@koa/router';
import Joi from 'joi';
import { verifyAuth } from '../middleware/login.middleware.js';
import HealthRecordController from '../controller/healthRecord.controller.js';
import { validate } from '../utils/validator.js';

export const healthRecordRouter = new KoaRouter({ prefix: '/healthRecord' });

const healthRecordSchema = Joi.object({
  type: Joi.string().valid('bloodPressure', 'bloodSugar', 'weight', 'heartRate', 'other').required(),
  value: Joi.number().required(),
  unit: Joi.string().allow('', null),
  recordTime: Joi.date().iso().required()
});

/**
 * @openapi
 * /healthRecord:
 *   post:
 *     summary: 新增健康记录
 *     tags:
 *       - Health
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               value:
 *                 type: number
 *               unit:
 *                 type: string
 *               recordTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: 保存成功
 */
healthRecordRouter.post('/', verifyAuth, validate(healthRecordSchema), HealthRecordController.upsert);

/**
 * @openapi
 * /healthRecord:
 *   get:
 *     summary: 获取当前用户的健康记录列表
 *     tags:
 *       - Health
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 查询成功
 */
healthRecordRouter.get('/', verifyAuth, HealthRecordController.list);


