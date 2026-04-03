import { Server as SocketServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';

let io: SocketServer;

/**
 * Initialize Socket.IO server with the HTTP server
 */
export const initializeSocket = (httpServer: HTTPServer): SocketServer => {
  const origins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : [];

  io = new SocketServer(httpServer, {
    cors: {
      origin: origins,
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Join a room for a specific auction item
    socket.on('join-auction', (itemId: string) => {
      socket.join(`auction-${itemId}`);
      console.log(`📦 ${socket.id} joined auction-${itemId}`);
    });

    // Leave an auction room
    socket.on('leave-auction', (itemId: string) => {
      socket.leave(`auction-${itemId}`);
      console.log(`📦 ${socket.id} left auction-${itemId}`);
    });

    // Join room to receive all auction updates (for browse page)
    socket.on('join-auctions-list', () => {
      socket.join('auctions-list');
      console.log(`📋 ${socket.id} joined auctions-list`);
    });

    socket.on('leave-auctions-list', () => {
      socket.leave('auctions-list');
      console.log(`📋 ${socket.id} left auctions-list`);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });

  return io;
};

/**
 * Get the Socket.IO server instance
 * Call this after initializeSocket has been called
 */
export const getIO = (): SocketServer => {
  if (!io) {
    throw new Error('Socket.IO has not been initialized. Call initializeSocket first.');
  }
  return io;
};
