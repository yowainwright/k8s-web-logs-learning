"use client";

import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import dynamic from 'next/dynamic';

const Terminal = dynamic(() => import('./Terminal'), { ssr: false });

type TerminalWrapperProps = {
  socket?: Socket | null;
}

type PodsProps = {
  pods: string[];
}

type ClientDetailsProps = {
  socket: Socket;
  pods: string[];
}

export const TerminalWrapper = ({ socket }: TerminalWrapperProps) => {
  if (!socket) return <div>Connecting...</div>;
  return <Terminal socket={socket} />;
}

export const Pods = ({ pods }: PodsProps) => {
  if (!pods || pods.length === 0) return null;
  return (
    <div>
      <h3>Available Pods:</h3>
      <ul>
        {pods.map((pod, index) => (
          <li key={index}>{pod}</li>
        ))}
      </ul>
    </div>
  );
}

export const ClientDetails = ({ pods, socket }: ClientDetailsProps) => (
    <div>
      <h2>Checkout these logs!</h2>
      <TerminalWrapper socket={socket} />
      <Pods pods={pods} />
    </div>
  );

export default function Client() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [pods, setPods] = useState<string[]>([]);

  useEffect(() => {
  const newSocket = io({
    path: '/api/socket',
  });

  newSocket.on('connect', () => {
    console.log('Connected to server');
    newSocket.emit('list_pods');
  });

  newSocket.on('connect_error', (error) => {
    console.error('Connection Error:', error);
  });

  newSocket.on('pod_list', (receivedPods) => {
    console.log('Received pods:', receivedPods);
    setPods(receivedPods);
  });

  setSocket(newSocket);

  return () => {
    newSocket.disconnect();
  };
}, []);

  if (!socket || !pods) return <div>Connecting...</div>;

  return (<ClientDetails socket={socket} pods={pods} />);
}
