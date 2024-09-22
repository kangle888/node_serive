import FormDataListService from '../service/formDataList.service.js';

class FormDataList {
  formDataList = async (ctx) => {

    
    const { page, size } = ctx.request.body;
    console.log('formDataLi及来了吗');
    const result = await FormDataListService.getFormDataList(page, size);
    ctx.body = {
      code: 200,
      message: '查询成功',
      data: result
    }

  }
}


export default new FormDataList();