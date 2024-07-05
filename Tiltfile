# Suppress unused image warning
update_settings(suppress_unused_image_warnings=["k9s-web-deps"])

# Ensure kind cluster is running
local_resource(
    'ensure-cluster',
    cmd='kind get clusters | grep k9s-web || kind create cluster --name k9s-web',
    deps=[],
)

# Define a volume for node_modules
docker_build(
    'k9s-web-deps',
    '.',
    dockerfile='Dockerfile',
    target='dependencies',
    only=['package.json', 'pnpm-lock.yaml'],
    live_update=[
        sync('./package.json', '/app/package.json'),
        sync('./pnpm-lock.yaml', '/app/pnpm-lock.yaml'),
        run('pnpm install', trigger=['package.json', 'pnpm-lock.yaml']),
    ],
)

# Build the main application image
docker_build(
    'k9s-web-image',
    '.',
    dockerfile='Dockerfile',
    target='development',
    live_update=[
        sync('.', '/app'),
        run('pnpm install', trigger='package.json'),
    ],
)

# Deploy logging pods
k8s_yaml('logging-deployment.yaml')

# Deploy Next.js app
k8s_yaml(kustomize('kubernetes'))

# Port forward for Next.js app
k8s_resource('k9s-web', port_forwards='3000:3000', resource_deps=['ensure-cluster'])

# Configure the log-generator resource
k8s_resource('log-generator', resource_deps=['ensure-cluster'])
