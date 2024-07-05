update_settings(suppress_unused_image_warnings=["k9s-web-deps"])

local_resource(
    'ensure-cluster',
    cmd='kind get clusters | grep k9s-web || kind create cluster --name k9s-web',
    deps=[],
)

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

k8s_yaml('logging-deployment.yaml')

k8s_yaml(kustomize('kubernetes'))


k8s_resource(
    'k9s-web',
    port_forwards='3000:3000',
    resource_deps=['ensure-cluster'],
    links=[
        link('http://localhost:3000', 'App'),
        link('http://localhost:3000/api/logs', 'Logs')
    ]
)

k8s_resource('log-generator', resource_deps=['ensure-cluster'])
