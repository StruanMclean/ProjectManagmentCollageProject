// lib/useWebSocket.ts
import { WS_URL } from '@/auth/auth';
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useWebSocket = (groupId: number) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    console.log("Setting up socket connection");
    
    const socketInstance = io(WS_URL, {
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socketRef.current = socketInstance;

    return () => {
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !connected) return;

    console.log(`Setting up listener for group-${groupId}`);
    
    socket.emit('updateRealtime', { group_id: groupId });
    
    const eventName = `group-${groupId}`;
    
    const handleGroupMessage = (data: any) => {
      setMessages(data);
    };
    
    socket.on(eventName, handleGroupMessage);
    
    return () => {
      console.log(`Removing listener for group-${groupId}`);
      socket.off(eventName, handleGroupMessage);
      setMessages([]);
    };
  }, [groupId, connected]);

  const sendMessage = (data: any) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('updateRealtime', data);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    socket: socketRef.current,
    connected,
    messages: messages,
    sendMessage,
    clearMessages
  };
};