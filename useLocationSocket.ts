import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = "https://nearu.kalametiyaseafoodrestaurant.com";

export const useLocationSocket = (circleId: string, userId: string) => {
  const [members, setMembers] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
   
    socketRef.current = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('✅ Connected to Socket Server');
      setIsConnected(true);
      
 
      socket.emit('join_circle', circleId);
    });

   
    socket.on('circle_data_sync', (data: any[]) => {
      console.log('🔄 Received Circle Data:', data);
      setMembers(data);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Socket Disconnected');
    });

   
    return () => {
      socket.disconnect();
    };
  }, [circleId]);

 
  const sendLocationUpdate = (lat: number, lon: number, speed: number, battery: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send_location', {
        circleId,
        userId,
        latitude: lat,
        longitude: lon,
        speed: speed,
        battery: battery,
        name: "Mobile User"
      });
    }
  };

  return { members, isConnected, sendLocationUpdate };
};
