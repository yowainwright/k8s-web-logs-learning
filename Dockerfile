FROM node:20-alpine AS base
WORKDIR /app

RUN npm install -g pnpm

# kubernetes
RUN apk add --no-cache curl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
  install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

FROM base AS dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

FROM base AS development
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
