FROM docker.1ms.run/node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm
RUN pnpm config set registry https://registry.npmmirror.com

# Copy package files
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
RUN corepack enable pnpm
RUN pnpm config set registry https://registry.npmmirror.com

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV PAYLOAD_SECRET=914c0e84da3ca5c74d4fc0e0
ENV DATABASE_URI=file:./data/payload.db
ENV NODE_ENV=production

# Create data folder
RUN mkdir -p data

# Create and apply payload migration
RUN pnpm payload migrate:create
RUN pnpm payload migrate

# Seed data
RUN pnpm seed:dev

# Build the Next.js application
RUN pnpm build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN corepack enable pnpm

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy database from builder stage
COPY --from=builder /app/data ./data

COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

# Copy and set permissions for entrypoint script
COPY scripts/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh

# Set ownership of data directory
RUN chown -R nextjs:nodejs data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use the entrypoint script
CMD ["./docker-entrypoint.sh"]