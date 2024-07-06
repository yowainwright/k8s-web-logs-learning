update_settings(suppress_unused_image_warnings=["k8s-web-deps"])

local_resource(
    'ensure-cluster',
    cmd='kind get clusters | grep k8s-web || kind create cluster --name k8s-web',
    deps=[],
)

docker_build(
    'k8s-web-deps',
    '.',
    dockerfile='Dockerfile',
    target='dependencies',
    only=['package.json', 'pnpm-lock.yaml'],
    live_update=[
        sync('./', '/app'),
        run('pnpm install', trigger=['package.json', 'pnpm-lock.yaml']),
        run('pnpm build', trigger='./next.config.mjs')
    ],
)

docker_build(
    'k8s-web-image',
    '.',
    dockerfile='Dockerfile',
    target='development',
    live_update=[
        sync('.', '/app'),
        run('pnpm install', trigger='package.json'),
    ],
)

k8s_yaml('logging-deployment.yaml')

local_resource(
    'create-namespace',
    cmd='kubectl get namespace k8s-web || kubectl create namespace k8s-web',
    deps=[],  # No dependencies
)

k8s_yaml('k8s-web-deployment.yaml')


k8s_resource(
    'k8s-web',
    port_forwards='3000:3000',
    resource_deps=['ensure-cluster'],
    links=[
        link('http://localhost:3000', 'App'),
        link('http://localhost:3000/api/logs', 'Logs')
    ]
)

k8s_resource('log-generator', resource_deps=['ensure-cluster'])
