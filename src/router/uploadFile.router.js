import KoaRouter from '@koa/router';
import { verifyAuth } from '../middleware/login.middleware.js';
import UploadFileController from '../controller/uploadFile.controller.js';


export const uploadFileRouter = new KoaRouter({ prefix: '/uploadFile' });
/**
 * 上传文件
 */
uploadFileRouter.post('/base64', UploadFileController.uploadFile);

/**
 * 大文件上传
 */
uploadFileRouter.post('/chunk', UploadFileController.uploadChunk);

/**
 * 合并文件
 */
uploadFileRouter.post('/merge', UploadFileController.mergeFile);

/**
 * 校验文件
 */

uploadFileRouter.post('/verify', UploadFileController.verifyFile);