import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { logger } from '../lib/logger';

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1'
).replace('/api/v1', '');

let socketInstance: Socket | null = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
    });
  }
  return socketInstance;
};

export const useSocket = (
  eventHandler?: (data: any) => void,
  userId?: string,
  eventName: string = 'new-notification',
  rooms: string[] = [],
) => {
  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      logger.info('Connected to socket server');
      if (userId) {
        socket.emit('join-user-room', userId);
      }
      rooms.forEach((room) => socket.emit('join-room', room));
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on('connect', handleConnect);

    if (eventHandler) {
      socket.on(eventName, eventHandler);
    }

    return () => {
      socket.off('connect', handleConnect);
      if (eventHandler) {
        socket.off(eventName, eventHandler);
      }
    };
  }, [eventHandler, userId, eventName, JSON.stringify(rooms)]);

  return socketInstance;
};
