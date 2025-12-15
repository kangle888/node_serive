import UploadFileDAO from '../dao/uploadFile.dao.js';

class uploadFileService {
  async saveFileInfoToDatabase(filehash, filename, filePath, openid) {
    // 先按文件内容 hash 查重，命中则认为是同一文件
    const exists = await UploadFileDAO.findByHash(filehash);
    if (exists) {
      // 如果之前没关联 openid，则补上
      if (openid && !exists.openid) {
        await UploadFileDAO.create({
          filehash,
          filename,
          filepath: filePath,
          openid
        });
      }
      return '文件已存在';
    }
    // 未命中 hash，则按 openid 维度插一条记录
    await UploadFileDAO.create({ filehash, filename, filepath: filePath, openid });
    return '文件上传成功';
  }
}

export default new uploadFileService();