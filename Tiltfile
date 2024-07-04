# Deploy kind cluster
local_resource(
    'kind-cluster',
    cmd='kind create cluster --name k9s-web || true',
    deps=[],
)

docker_build('k9s-web-image', '.',
    dockerfile='Dockerfile',
    live_update=[
        sync('.', '/app'),
        run('pnpm install', trigger='package.json'),
        run('pnpm build', trigger=['pages', 'components', 'lib']),
    ]
)

k8s_yaml('logging-deployment.yaml')

k8s_yaml(kustomize('k8s'))

k8s_resource('k9s-web', port_forwards='3000:3000')
