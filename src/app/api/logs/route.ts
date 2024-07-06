// /src/app/api/logs/[podName].ts
import { NextRequest } from 'next/server';
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';

export async function GET(req: NextRequest, { params }: { params: { podName: string } }) {
  const podName = params.podName;
  const namespace = 'k8s-web'; // Your namespace

  try {
    console.log({ podName, namespace });
    // Load Kubernetes configuration
    const kc = new KubeConfig();
    kc.loadFromDefault(); // Or use in-cluster config if applicable

    const k8sApi = kc.makeApiClient(CoreV1Api);

    const logs = await k8sApi.readNamespacedPodLog(podName, namespace);
    console.log({ logs });
    return new Response(logs.body, { status: 200, headers: { 'Content-Type': 'text/plain' } });

  } catch (error) {
    console.error("Error fetching logs:", error);
    return new Response("Error fetching logs", { status: 500 });
  }
}
