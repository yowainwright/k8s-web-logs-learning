"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

export const Terminal = dynamic(() => import('./Terminal'), { ssr: false });

export type TerminalProps = {
  logs: string;
  selectedPod: string | null;
};

export type PodsProps = {
  pods: string[];
  onPodSelect: (podName: string) => void;
};

export const TerminalWrapper = ({ logs, selectedPod }: TerminalProps) => {
  if (!selectedPod) return null;
  if (!logs?.length) return <p>Loading logs...</p>;
  return <Terminal logs={logs} />;
};

export const Pods = ({ pods, onPodSelect }: PodsProps) => {
  if (!pods.length) return <p>Loading pods...</p>;
  return (
    <div>
      <h3>Available Pods:</h3>
      <ul>
        {pods.map((pod) => (
          <li key={pod} onClick={() => onPodSelect(pod)}>
            {pod}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Client() {
  const [logs, setLogs] = useState('');
  const [selectedPod, setSelectedPod] = useState<string | null>(null);
  const [pods, setPods] = useState<string[]>([]);

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
        console.error("Error fetching pods:", error);
        setPods(["Failed to fetch pods. Please try again later."]);
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
          console.error("Error fetching logs:", error);
          setLogs("Failed to fetch logs. Please try again later.");
        }
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);

    return () => clearInterval(interval);
  }, [selectedPod]);

  const handlePodSelect = (podName: string) => setSelectedPod(podName);

  console.log({ selectedPod, pods, log: 'pods info' });

  return (
    <div>
      <h2>Kubernetes Pod Logs</h2>
      <Pods pods={pods} onPodSelect={handlePodSelect} />
      <TerminalWrapper logs={logs} selectedPod={selectedPod} />
    </div>
  );
}
