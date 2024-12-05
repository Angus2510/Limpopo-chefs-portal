// src/contexts/SocketContext.js
"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) {
      console.warn("User ID is not provided, socket connection will not be initialized.");
      return;
    }

    console.log("Initializing socket connection with user ID:", userId);
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
      timeout: 3000,
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
    });

    socketInstance.on('reconnect', () => {
      console.log('Socket reconnected successfully');
    });

    socketInstance.emit('join', userId);
    setSocket(socketInstance);

    console.log("Socket connection established.");

    return () => {
      socketInstance.disconnect();
      console.log("Socket connection closed.");
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
