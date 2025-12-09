import knexClient from '../database/knexClient.js';

const ROOM_MEMBER_TABLE = 'room_members';

class RoomMemberDAO {
  add(member, trx = null) {
    const query = knexClient(ROOM_MEMBER_TABLE).insert(member);
    return trx ? query.transacting(trx) : query;
  }

  findByRoomAndUser(roomId, userId) {
    return knexClient(ROOM_MEMBER_TABLE).where({ room_id: roomId, user_id: userId }).first();
  }

  findById(memberId) {
    return knexClient(ROOM_MEMBER_TABLE).where({ id: memberId }).first();
  }

  listByRoom(roomId) {
    return knexClient(ROOM_MEMBER_TABLE)
      .where({ room_id: roomId })
      .select('*')
      .orderBy('joined_at', 'asc');
  }

  listByIds(memberIds) {
    return knexClient(ROOM_MEMBER_TABLE).whereIn('id', memberIds);
  }

  incrementBalance(memberId, delta, trx = null) {
    const query = knexClient(ROOM_MEMBER_TABLE).where({ id: memberId }).increment('balance', delta);
    return trx ? query.transacting(trx) : query;
  }

  removeById(memberId, trx = null) {
    const query = knexClient(ROOM_MEMBER_TABLE).where({ id: memberId }).del();
    return trx ? query.transacting(trx) : query;
  }

  removeByRoom(roomId, trx = null) {
    const query = knexClient(ROOM_MEMBER_TABLE).where({ room_id: roomId }).del();
    return trx ? query.transacting(trx) : query;
  }

  removeByRoomAndUser(roomId, userId, trx = null) {
    const query = knexClient(ROOM_MEMBER_TABLE).where({ room_id: roomId, user_id: userId }).del();
    return trx ? query.transacting(trx) : query;
  }
}

export default new RoomMemberDAO();

