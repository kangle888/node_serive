import connection from '../app/database.js';

class uploadFileService {
  async saveFileInfoToDatabase(filehash, filename, filePath) {

    // 1、首先查询数据库中是否有相同的文件hash
    const statement = `SELECT * FROM uploaded_images_files WHERE filehash = ?;`;
    const [res] = await connection.execute(statement, [filehash]);
    // 如果有相同的文件hash，则返回错误
    if (res.length) {
      return '文件已存在';
    }else{
      // 2、如果没有相同的文件hash，则将文件信息保存到数据库中
      const statement = `INSERT INTO uploaded_images_files (filehash, filename, filepath) VALUES (?, ?, ?);`;
      const [res] = await connection.execute(statement, [filehash, filename, filePath]);
      return '文件上传成功';
    }

  }

}

export default new uploadFileService();