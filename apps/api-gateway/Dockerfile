# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copy workspace configs
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml turbo.json ./

# Copy all source code
COPY packages ./packages
COPY apps ./apps

# Install ALL dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm --filter=@repo/database exec prisma generate

# Build the specific app (change filter accordingly)
RUN pnpm turbo run build --filter=api-gateway

# --- Stage 2: Production ---
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm

# Copy workspace configuration files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copy package.json files for dependency resolution
COPY --from=builder /app/apps/api-gateway/package.json ./apps/api-gateway/
COPY --from=builder /app/packages ./packages

# Install ONLY production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy the built application
COPY --from=builder /app/apps/api-gateway/dist ./apps/api-gateway/dist

# Copy generated Prisma client if exists
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD ["node", "apps/api-gateway/dist/index.js"]