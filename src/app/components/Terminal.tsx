"use client";

import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import styles from '../Terminal.module.css';

interface TerminalProps {
  socket: Socket;
}

export default function Terminal({ socket }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);

  useEffect(() => {
    if (!xtermRef.current && terminalRef.current) {
      xtermRef.current = new XTerm();
      const fitAddon = new FitAddon();
      xtermRef.current.loadAddon(fitAddon);
      xtermRef.current.open(terminalRef.current);
      fitAddon.fit();

      socket.on('log_line', ({ pod, line }) => {
        xtermRef.current?.writeln(`[${pod}] ${line}`);
      });
    }

    return () => {
      socket.off('log_line');
    };
  }, [socket]);

  return <div ref={terminalRef} className={styles.terminalContainer} />;
}
