import knexClient from '../database/knexClient.js';
import RoomDAO from '../dao/room.dao.js';
import RoomMemberDAO from '../dao/roomMember.dao.js';
import RoomTransactionDAO from '../dao/roomTransaction.dao.js';
import eventBus from '../utils/event-bus.js';
import { generateId } from '../utils/id-generator.js';
import { generateInviteCode } from '../utils/invite-code.js';

class RoomService {
  async createRoom({ name, creatorId }) {
    const roomId = generateId();
    const memberId = generateId();
    const inviteCode = await this.generateUniqueInviteCode();

    await knexClient.transaction(async (trx) => {
      await RoomDAO.create(
        {
          id: roomId,
          name,
          invite_code: inviteCode,
          creator_id: creatorId
        },
        trx
      );
      await RoomMemberDAO.add(
        {
          id: memberId,
          room_id: roomId,
          user_id: creatorId,
          balance: 0
        },
        trx
      );
    });

    const detail = await this.getRoomDetail(roomId);
    eventBus.emit('room:member_joined', {
      roomId,
      member: detail.members.find((m) => m.id === memberId)
    });

    return detail;
  }

  async generateUniqueInviteCode() {
    let code = generateInviteCode();
    let existing = await RoomDAO.findByInviteCode(code);
    while (existing) {
      code = generateInviteCode();
      existing = await RoomDAO.findByInviteCode(code);
    }
    return code;
  }

  async joinRoom({ inviteCode, userId }) {
    const room = await RoomDAO.findByInviteCode(inviteCode);
    if (!room) {
      throw new Error('房间不存在或邀请码无效');
    }

    const existedMember = await RoomMemberDAO.findByRoomAndUser(room.id, userId);
    if (existedMember) {
      return existedMember;
    }

    const member = {
      id: generateId(),
      room_id: room.id,
      user_id: userId,
      balance: 0
    };

    await RoomMemberDAO.add(member);
    eventBus.emit('room:member_joined', { roomId: room.id, member });
    return member;
  }

  async getRoomDetail(roomId) {
    const room = await RoomDAO.findById(roomId);
    if (!room) return null;
    const members = await RoomMemberDAO.listByRoom(roomId);
    const transactions = await RoomTransactionDAO.listByRoom(roomId, 20);
    return { room, members, transactions };
  }

  async listUserRooms(userId) {
    return RoomDAO.listRoomsByUser(userId);
  }

  async recordTransfer({ roomId, fromMemberId, toMemberId, amount, remark }) {
    if (fromMemberId === toMemberId) {
      throw new Error('不能给自己转账');
    }
    if (amount <= 0) {
      throw new Error('金额必须大于0');
    }

    const members = await RoomMemberDAO.listByIds([fromMemberId, toMemberId]);
    const memberMap = new Map(members.map((item) => [item.id, item]));
    const fromMember = memberMap.get(fromMemberId);
    const toMember = memberMap.get(toMemberId);
    if (!fromMember || !toMember) throw new Error('成员不存在');
    if (fromMember.room_id !== roomId || toMember.room_id !== roomId) {
      throw new Error('成员不属于该房间');
    }

    const txnId = generateId();
    await knexClient.transaction(async (trx) => {
      await RoomTransactionDAO.create(
        {
          id: txnId,
          room_id: roomId,
          from_member_id: fromMemberId,
          to_member_id: toMemberId,
          amount,
          remark: remark || ''
        },
        trx
      );
      await RoomMemberDAO.incrementBalance(fromMemberId, -amount, trx);
      await RoomMemberDAO.incrementBalance(toMemberId, amount, trx);
    });

    const updatedMembers = await RoomMemberDAO.listByIds([fromMemberId, toMemberId]);
    const updatedMap = new Map(updatedMembers.map((item) => [item.id, item]));
    const updatedFrom = updatedMap.get(fromMemberId);
    const updatedTo = updatedMap.get(toMemberId);
    const transaction = await RoomTransactionDAO.listByRoom(roomId, 1).then((rows) => rows[0]);

    eventBus.emit('room:transaction_created', {
      roomId,
      transaction,
      balances: {
        [updatedFrom.id]: updatedFrom.balance,
        [updatedTo.id]: updatedTo.balance
      }
    });

    eventBus.emit('room:balance_updated', {
      roomId,
      members: [updatedFrom, updatedTo]
    });

    return transaction;
  }
}

export default new RoomService();

