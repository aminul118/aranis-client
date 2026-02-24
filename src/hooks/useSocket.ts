import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1'
).replace('/api/v1', '');

export const useSocket = (
  eventHandler?: (data: any) => void,
  userId?: string,
  eventName: string = 'order-status-updated',
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');

      // Join user room if userId is provided
      if (userId) {
        socketRef.current?.emit('join-room', `user_${userId}`);
      }
    });

    if (eventHandler) {
      socketRef.current.on(eventName, eventHandler);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [eventHandler, userId]);

  return socketRef.current;
};
