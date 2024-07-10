"use client";

import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

interface TerminalProps {
  logs: string;
}

export default function Terminal({ logs }: TerminalProps) {
  console.log({ logs, log: 'terminal logs' });
  const terminalRef = useRef<HTMLDivElement>(null);
  const [term, setTerm] = useState<XTerm | null>(null);
  console.log({ logs, term, terminalRef, log: 'terminal state' });

  useEffect(() => {
    let terminal = null;
    const fitAddon = new FitAddon();

    if (terminalRef.current) {
      terminal = new XTerm();
      terminal.loadAddon(fitAddon);
      terminal.open(terminalRef.current);
      setTimeout(() => fitAddon.fit(), 300);
      setTerm(terminal);
    }

    return () => {
      if (terminal) terminal.dispose();
    }
  }, []);

  useEffect(() => {
    if (term) {
      const lines = logs.split('\n').map(line => line + '\n');
      lines.forEach(line => term.write(line));
    }
  }, [logs, term]);

  return <div ref={terminalRef} className="xterm border border-solid border-2 rounded-lg overflow-hidden" />;
}
