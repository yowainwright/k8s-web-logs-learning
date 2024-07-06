"use client";

import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import styles from '../Terminal.module.css';

interface TerminalProps {
  logs: string;
}

export default function Terminal({ logs }: TerminalProps) {
  console.log({ logs, log: 'terminal logs' });
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const [prevLogsLength, setPrevLogsLength] = useState(0);
  console.log({ terminalRef, xtermRef, prevLogsLength, log: 'terminal state' });

  useEffect(() => {
    if (terminalRef.current && !xtermRef.current) {
      xtermRef.current = new XTerm();
      const fitAddon = new FitAddon();
      xtermRef.current.loadAddon(fitAddon);
      xtermRef.current.open(terminalRef.current);
      fitAddon.fit();
    }

    if (xtermRef.current && logs.length > prevLogsLength) {
      const newLines = logs.substring(prevLogsLength).split('\n');
      newLines.forEach(line => xtermRef.current?.writeln(line));
      setPrevLogsLength(logs.length);
    }

    return () => {
      xtermRef.current?.dispose();
      xtermRef.current = null;
    };
  }, [logs, prevLogsLength]);

  return <div ref={terminalRef} className={styles.terminalContainer} />;
}
