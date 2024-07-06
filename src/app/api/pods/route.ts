import { NextRequest } from 'next/server';
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';

export async function GET(req: NextRequest) {
  const namespace = 'k8s-web';

  try {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const k8sApi = kc.makeApiClient(CoreV1Api);
    const res = await k8sApi.listNamespacedPod(namespace);

    // Extract pod names from the response
    const podNames = res.body.items.map(pod => pod.metadata?.name || '');
    const resp = new Response(JSON.stringify({ pods: podNames }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    console.log({ resp });
    return resp;

  } catch (error) {
    console.error("Error fetching pods:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch pods' }), { status: 500 });
  }
}
