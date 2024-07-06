// src/app/api/pods/route.ts

import { NextRequest } from 'next/server';
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';

export async function GET(req: NextRequest) {
  const namespace = 'k8s-web'; // Your namespace

  try {
    // Load Kubernetes configuration
    const kc = new KubeConfig();
    kc.loadFromDefault(); // Or use in-cluster config if applicable

    const k8sApi = kc.makeApiClient(CoreV1Api);

    // Fetch the list of pods in your namespace
    const res = await k8sApi.listNamespacedPod(namespace);

    // Extract pod names from the response
    const podNames = res.body.items.map(pod => pod.metadata?.name || '');

    return new Response(JSON.stringify({ pods: podNames }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error fetching pods:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch pods' }), { status: 500 });
  }
}
