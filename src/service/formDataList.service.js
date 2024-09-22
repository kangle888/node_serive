import connection from '../app/database.js';

class FormDataListService {
  getFormDataList = async (page = 1, size = 10) => {
    let offset = (page - 1) * size;
    const statement = `SELECT * FROM user_infor_list LIMIT ${size} OFFSET ${offset};`;
    try {
      const [result] = await connection.execute(statement);
      return result;
    } catch (error) {
      return ctx.body={code:500,message:error  ,data:{}};
    }
  }

}


export default new FormDataListService();