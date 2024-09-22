import KoaRouter from '@koa/router';
import FormDataList from '../controller/formDataList.controller.js';




export const formDataListRouter = new KoaRouter({ prefix: '/formDataList' })

formDataListRouter.post('/', FormDataList.formDataList);