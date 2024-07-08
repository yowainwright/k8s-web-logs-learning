local_resource(
    'ensure-cluster',
    cmd='kind get clusters | grep k8s-web || kind create cluster --name k8s-web',
)

docker_build(
    'k8s-web-image',
    '.',
    dockerfile='Dockerfile',
    build_args={'TARGET': 'development'},
)

# Apply your Kubernetes manifests
k8s_yaml('k8s-web-deployment.yaml')
k8s_yaml('logging-deployment.yaml')

k8s_resource(
    'k8s-web',
    port_forwards=3000,
    resource_deps=['ensure-cluster'],
)
