import KoaRouter from '@koa/router';
import Joi from 'joi';
import { verifyAuth } from '../middleware/login.middleware.js';
import UploadFileController from '../controller/uploadFile.controller.js';
import { validate } from '../utils/validator.js';

export const uploadFileRouter = new KoaRouter({ prefix: '/upload' });

const base64UploadSchema = Joi.object({
  base64: Joi.string().required(),
  filename: Joi.string().required()
});

/**
 * @openapi
 * /upload/base64:
 *   post:
 *     summary: 图片/文件 base64 上传
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               base64:
 *                 type: string
 *               filename:
 *                 type: string
 *     responses:
 *       200:
 *         description: 上传成功
 */
// 单文件/图片上传（base64）—— 需要登录
uploadFileRouter.post('/base64', verifyAuth, validate(base64UploadSchema), UploadFileController.uploadFile);

// 大文件分片上传相关接口（如不需要可后续再移除）—— 需要登录
uploadFileRouter.post('/chunk', verifyAuth, UploadFileController.uploadChunk);
uploadFileRouter.post('/merge', verifyAuth, UploadFileController.mergeFile);
uploadFileRouter.post('/verify', verifyAuth, UploadFileController.verifyFile);