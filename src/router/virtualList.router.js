import KoaRouter from '@koa/router';
import VirtualListController from '../controller/virtualList.controller.js';

export const virtualListRouter = new KoaRouter({ prefix: '/virtualList' });


virtualListRouter.post('/', VirtualListController.VirtualList);