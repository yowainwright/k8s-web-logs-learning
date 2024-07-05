import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import dynamic from 'next/dynamic';

const Terminal = dynamic(() => import('./components/Terminal'), { ssr: false });

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socket');
      const newSocket = io();
      setSocket(newSocket);
    };
    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('list_pods');
    }
  }, [socket]);

  if (!socket) return <div>Connecting...</div>;

  return <Terminal socket={socket} />;
}
