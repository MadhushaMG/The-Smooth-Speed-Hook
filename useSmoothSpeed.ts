import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = "https://nearu.kalametiyaseafoodrestaurant.com";

export const useNearuSocket = (circleId: string, userId: string) => {
  const [members, setMembers] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
  
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      forceNew: true
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('✅ Connected to Nearu Server');
      setIsConnected(true);
      

      socket.emit('join_circle', circleId);
    });

 
    socket.on('circle_data_sync', (data: any[]) => {
      console.log('🔄 Received Sync Data:', data);
      setMembers(data);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket Connection Error:', err.message);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Disconnected from Server');
    });

 
    return () => {
      if (socket) socket.disconnect();
    };
  }, [circleId]);


  const emitLocation = useCallback((locationData: {
    latitude: number;
    longitude: number;
    speed: number;
    battery: string;
    name: string;
  }) => {
    if (socketRef.current && isConnected) {
      const payload = {
        circleId,
        userId,
        ...locationData
      };
      
      console.log('📤 Sending Location:', payload);
      socketRef.current.emit('send_location', payload);
    }
  }, [circleId, userId, isConnected]);

  return { 
    members,      
    isConnected,  
    emitLocation  
  };
};
