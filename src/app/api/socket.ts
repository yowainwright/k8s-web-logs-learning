import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { listPods, streamPodLogs } from '../lib/kubernetes';

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!(res.socket as any).server.io) {
    console.log('Socket is initializing');
    const httpServer: NetServer = (res.socket as any).server as any;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket',
    });
    (res.socket as any).server.io = io;

    io.on('connection', (socket) => {
      console.log('New client connected');

      socket.on('list_pods', async () => {
        const pods = await listPods();
        socket.emit('pod_list', pods);
      });

      socket.on('stream_logs', async (podName: string) => {
        for await (const line of streamPodLogs(podName)) {
          socket.emit('log_line', { pod: podName, line });
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;
