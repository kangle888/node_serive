import UploadFileDAO from '../dao/uploadFile.dao.js';

class uploadFileService {
  async saveFileInfoToDatabase(filehash, filename, filePath) {
    const exists = await UploadFileDAO.findByHash(filehash);
    if (exists) {
      return '文件已存在';
    }
    await UploadFileDAO.create({ filehash, filename, filepath: filePath });
    return '文件上传成功';
  }
}

export default new uploadFileService();