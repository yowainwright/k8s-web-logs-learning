"use client";

import { useEffect, useState } from 'react';
//

// const Terminal = dynamic(() => import('./Terminal'), { ssr: false });

// type TerminalProps = {
//   logs: string;
// };

type PodsProps = {
  pods: string[];
  onPodSelect: (podName: string) => void;
};

// const TerminalWrapper = ({ logs }: TerminalProps) => {
//   return <Terminal logs={logs} />;
// };

const Pods = ({ pods, onPodSelect }: PodsProps) => {
  if (!pods || pods.length === 0) return null;
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
  // const [logs, setLogs] = useState('');
  const [selectedPod, setSelectedPod] = useState<string | null>(null);
  const [pods, setPods] = useState<string[]>([]);

  useEffect(() => {
    const fetchPods = async () => {
      const res = await fetch('/api/pods');
      if (res.ok) {
        const data = await res.json();
        console.log({ data, pods: data?.pods, selectedPod: data?.pods[0], log: 'pod data' });
        setPods(data.pods);
        setSelectedPod(data.pods[0]);
      }
    };

    fetchPods();
  }, []);

  // useEffect(() => {
  //   const fetchLogs = async () => {
  //     if (selectedPod) {
  //       try {
  //         const response = await fetch(`/api/logs/${selectedPod}`);
  //         const logData = await response.text();
  //         console.log({ logData, log: 'log data' });
  //         setLogs(logData);
  //       } catch (error) {
  //         console.error({ log: "Error fetching logs", error });
  //         setLogs('Error fetching logs');
  //       }
  //     }
  //   };

  //   fetchLogs();
  //   const interval = setInterval(fetchLogs, 5000);

  //   return () => clearInterval(interval);
  // }, [selectedPod]);

  const handlePodSelect = (podName: string) => {
    setSelectedPod(podName);
  };

  console.log({ selectedPod, pods, log: 'pods info' });

  return (
    <div>
      <h2>Kubernetes Pod Logs</h2>
      {/* <TerminalWrapper logs={logs} /> */}
      <Pods pods={pods} onPodSelect={handlePodSelect} />
    </div>
  );
}
