import { Server as SocketIOServer } from 'socket.io';
import { NextApiResponseServerIO } from '@/types/next';
import { listPods, streamPodLogs } from '../../lib/kubernetes';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

let io: SocketIOServer;

export async function GET(req: Request, res: NextApiResponseServerIO) {
  if (!io) {
    console.log('Socket is initializing');

    // @ts-ignore
    const httpServer = res.socket.server;

    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

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

    // @ts-ignore
    res.socket.server.io = io;
  } else {
    console.log('Socket is already initialized');
  }

  return new Response('SocketIO is running', {
    status: 200,
  });
}
