import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import styles from '../styles/Terminal.module.css';

type TerminalComponentProps = {
  socket: Socket;
};

export default function TerminalComponent({ socket }: TerminalComponentProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!xtermRef.current && terminalRef.current) {
      xtermRef.current = new Terminal();
      const fitAddon = new FitAddon();
      xtermRef.current.loadAddon(fitAddon);
      xtermRef.current.open(terminalRef.current);
      fitAddon.fit();

      xtermRef.current.onData((data: string) => {
        const podIndex = parseInt(data) - 1;
        if (!isNaN(podIndex) && podIndex >= 0) {
          socket.emit('stream_logs', pods[podIndex]);
        }
      });
    }

    socket.on('pod_list', (pods: string[]) => {
      if (xtermRef.current) {
        xtermRef.current.writeln('Available pods:');
        pods.forEach((pod, index) => {
          xtermRef.current?.writeln(`${index + 1}. ${pod}`);
        });
        xtermRef.current.writeln('Enter the number of the pod to stream logs:');
      }
    });

    socket.on('log_line', (data: { pod: string; line: string }) => {
      xtermRef.current?.writeln(`[${data.pod}] ${data.line}`);
    });

    return () => {
      socket.off('pod_list');
      socket.off('log_line');
    };
  }, [socket]);

  return <div ref={terminalRef} className={styles.terminalContainer} />;
}
