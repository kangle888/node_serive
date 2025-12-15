import knexClient from '../database/knexClient.js';

const TABLE = 'uploaded_images_files';

class UploadFileDAO {
  findByHash(filehash) {
    return knexClient(TABLE).where({ filehash }).first();
  }

  findByOpenid(openid) {
    return knexClient(TABLE).where({ openid }).first();
  }

  create(data) {
    return knexClient(TABLE).insert({
      filehash: data.filehash,
      filename: data.filename,
      filepath: data.filepath,
      openid: data.openid || null
    });
  }
}

export default new UploadFileDAO();
