import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PUBLIC_KEY } from '../config/screct.js';
import RoomMemberDAO from '../dao/roomMember.dao.js';
import eventBus from '../utils/event-bus.js';

let io = null;

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) {
    next(new Error('UNAUTHORIZED'));
    return;
  }
  try {
    const payload = jwt.verify(token.replace(/^Bearer\s+/i, ''), PUBLIC_KEY, {
      algorithms: ['RS256']
    });
    socket.user = payload;
    next();
  } catch (error) {
    next(new Error('UNAUTHORIZED'));
  }
};

const onConnection = (socket) => {
  socket.on('room:join', async ({ roomId }) => {
    if (!roomId) {
      socket.emit('room:error', { message: 'roomId 不能为空' });
      return;
    }
    try {
      const member = await RoomMemberDAO.findByRoomAndUser(roomId, socket.user.id);
      if (!member) {
        socket.emit('room:error', { message: '您不在该房间或房间不存在' });
        return;
      }
      socket.join(roomId);
      socket.emit('room:joined', { roomId, memberId: member.id });
    } catch (error) {
      socket.emit('room:error', { message: error.message });
    }
  });

  socket.on('room:leave', ({ roomId }) => {
    if (roomId) {
      socket.leave(roomId);
    }
  });

  socket.on('disconnect', () => {
    // Placeholder for future cleanup if needed
  });
};

export const initRealtime = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  io.use(authenticateSocket);
  io.on('connection', onConnection);

  eventBus.on('room:member_joined', (payload) => {
    io.to(payload.roomId).emit('room:member_joined', payload);
  });

  eventBus.on('room:transaction_created', (payload) => {
    io.to(payload.roomId).emit('room:transaction_created', payload);
  });

  eventBus.on('room:balance_updated', (payload) => {
    io.to(payload.roomId).emit('room:balance_updated', payload);
  });

  return io;
};

export const getIO = () => io;


