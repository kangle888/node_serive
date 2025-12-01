import knexClient from '../database/knexClient.js';

const TABLE = 'uploaded_images_files';

class UploadFileDAO {
  findByHash(filehash) {
    return knexClient(TABLE).where({ filehash }).first();
  }

  create(data) {
    return knexClient(TABLE).insert(data);
  }
}

export default new UploadFileDAO();


