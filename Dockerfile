FROM node:20-alpine AS base
WORKDIR /app

RUN npm install -g pnpm

FROM base AS dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

FROM base AS development
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
