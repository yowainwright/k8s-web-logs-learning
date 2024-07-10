"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from "@/components/ui/card";
import { Pods } from './Pods';

export const Terminal = dynamic(() => import('./Terminal'), { ssr: false });

export type TerminalProps = {
  logs: string;
  selectedPod: string | null;
};

export const TerminalWrapper = ({ logs, selectedPod }: TerminalProps) => {
  if (!selectedPod) return null;
  if (!logs?.length) return <p>Loading logs...</p>;
  return <Terminal logs={logs} />;
};

export default function Client() {
  const [logs, setLogs] = useState('');
  const [selectedPod, setSelectedPod] = useState<string | null>(null);
  const [pods, setPods] = useState<string[]>([]);
  const [_, setIsLoadingPods] = useState(true);

  useEffect(() => {
    const fetchPods = async () => {
      try {
        const res = await fetch('/api/pods');
        if (!res.ok) throw new Error('Failed to fetch pods');
        const data = await res.json();
        const pods = data?.pods;
        if (pods) setPods(pods);
        const initialPod = pods?.[0];
        if (initialPod) setSelectedPod(initialPod);
      } catch (error) {
        setPods(["Failed to fetch pods. Please try again later."]);
      } finally {
        setIsLoadingPods(false);
      }
    };

    fetchPods();
  }, []);

  useEffect(() => {
     const fetchLogs = async () => {
      if (selectedPod) {
        try {
          const response = await fetch('/api/exec', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              command: ['kubectl', 'logs', selectedPod, '-n', 'k8s-web'],
            }),
          });
          const logData = await response.text();
          if (logData) setLogs(logData);
        } catch (error) {
          setLogs("Failed to fetch logs. Please try again later.");
        } finally {
        }
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);

    return () => clearInterval(interval);
  }, [selectedPod]);

  return (
    <Card className="w-full max-w-3xl">
      <CardContent>
        <div className="py-4">
          <Pods pods={pods} setSelectedPod={setSelectedPod} selectedPod={selectedPod} />
        </div>
        <TerminalWrapper logs={logs} selectedPod={selectedPod} />
      </CardContent>
    </Card>
  );
}
