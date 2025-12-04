import knexClient from '../database/knexClient.js';

const ROOM_TABLE = 'rooms';

class RoomDAO {
  create(room, trx = null) {
    const query = knexClient(ROOM_TABLE).insert(room);
    return trx ? query.transacting(trx) : query;
  }

  findByInviteCode(inviteCode) {
    return knexClient(ROOM_TABLE).where({ invite_code: inviteCode }).first();
  }

  findById(roomId) {
    return knexClient(ROOM_TABLE).where({ id: roomId }).first();
  }

  listRoomsByUser(userId) {
    return knexClient(ROOM_TABLE)
      .join('room_members', 'rooms.id', 'room_members.room_id')
      .where('room_members.user_id', userId)
      .select('rooms.*', 'room_members.id as member_id');
  }
}

export default new RoomDAO();

