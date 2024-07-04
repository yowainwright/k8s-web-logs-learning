import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

export async function listPods(): Promise<string[]> {
  const res = await k8sApi.listNamespacedPod('default');
  return res.body.items.map(pod => pod.metadata!.name!);
}

export async function* streamPodLogs(podName: string): AsyncGenerator<string> {
  const logStream = await k8sApi.readNamespacedPodLog(podName, 'default', undefined, undefined, undefined, undefined, undefined, undefined, true);
  for await (const line of logStream) {
    yield line;
  }
}
