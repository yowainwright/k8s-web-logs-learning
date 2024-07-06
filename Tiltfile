# Tiltfile
local_resource(
    'ensure-cluster',
    cmd='kind get clusters | grep k8s-web || kind create cluster --name k8s-web',
)

# Build your Docker image and load it into Kind
docker_build(
    'k8s-web-image',
    '.',
    dockerfile='Dockerfile',
    build_args={'TARGET': 'development'},
)

# Manually load the image into Kind after building
local_resource(
    'load-k8s-web-image',
    cmd='kind load docker-image k8s-web-image --name k8s-web',
    deps=['k8s-web-image'],
)
# Apply your Kubernetes manifests
k8s_yaml('k8s-web-deployment.yaml')
k8s_yaml('logging-deployment.yaml')


# Deploy your Next.js app (depends on the image being built)
k8s_resource(
    'k8s-web',
    port_forwards=3000,  # Forward port 3000
    resource_deps=['load-k8s-web-image']
)
