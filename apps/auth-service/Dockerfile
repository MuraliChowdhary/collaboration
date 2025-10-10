# Stage 1: Build
FROM node:18-slim AS builder

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./
COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile
RUN pnpm --filter=@repo/database exec prisma generate
RUN pnpm --filter=@repo/database run build
RUN pnpm turbo run build --filter=auth-service

# --- Stage 2: Production ---
FROM node:18-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install pnpm (IMPORTANT - was missing!)
RUN npm install -g pnpm

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/turbo.json ./

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/auth-service ./apps/auth-service
COPY --from=builder /app/packages ./packages

EXPOSE 3001

CMD ["node", "apps/auth-service/dist/index.js"]