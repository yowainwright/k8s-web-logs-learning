import { NextRequest } from 'next/server';
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';

export async function GET(req: NextRequest, { params }: { params: { podName: string } }) {
  const podName = params.podName;
  const namespace = 'k8s-web';

  try {
    console.log({ podName, namespace, req, log: 'podName/namespace' });
    const kc = new KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(CoreV1Api);

    const logs = await k8sApi.readNamespacedPodLog(podName, namespace);
    console.log({ logs, log: 'pod logs' });
    const resp = new Response(logs.body, { status: 200, headers: { 'Content-Type': 'text/plain' } });
    console.log({ resp, log: 'pod logs response' });
    return resp;

  } catch (error) {
    console.error("Error fetching logs:", error);
    return new Response("Error fetching logs", { status: 500 });
  }
}
