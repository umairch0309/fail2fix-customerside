# Base: real Node 22.23.4, with the Bun binary copied in for installs
FROM node:22.23.4-alpine AS base
RUN apk add --no-cache libstdc++ libgcc
COPY --from=oven/bun:1-alpine /usr/local/bin/bun /usr/local/bin/bun

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js will load from .env file during build

RUN bun run build

# Stage 3: Production server (Node only, no Bun needed)
FROM node:22.23.4-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
