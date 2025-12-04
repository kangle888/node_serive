import knexClient from '../database/knexClient.js';

const ROOM_TRANSACTION_TABLE = 'room_transactions';

class RoomTransactionDAO {
  create(txn, trx = null) {
    const query = knexClient(ROOM_TRANSACTION_TABLE).insert(txn);
    return trx ? query.transacting(trx) : query;
  }

  listByRoom(roomId, limit = 50) {
    return knexClient(ROOM_TRANSACTION_TABLE)
      .where({ room_id: roomId })
      .orderBy('created_at', 'desc')
      .limit(limit);
  }
}

export default new RoomTransactionDAO();


