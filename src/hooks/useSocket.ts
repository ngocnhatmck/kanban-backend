import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

export function useSocket(boardId: string, onUpdate: () => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
      if (boardId) {
        socket.emit('joinBoard', boardId);
      }
    });

    // Handle incoming updates from other users
    const handleUpdate = () => {
      console.log('🔄 Socket event received, refreshing board...');
      onUpdate();
    };

    socket.on('boardUpdated', handleUpdate);
    socket.on('columnCreated', handleUpdate);
    socket.on('taskCreated', handleUpdate);
    socket.on('taskUpdated', handleUpdate);
    socket.on('taskDeleted', handleUpdate);

    return () => {
      if (boardId) {
        socket.emit('leaveBoard', boardId);
      }
      socket.disconnect();
    };
  }, [boardId, onUpdate]);

  return socketRef.current;
}

export default useSocket;
