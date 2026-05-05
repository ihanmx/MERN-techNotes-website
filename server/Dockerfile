# ============================================================
# Stage 1 — "builder": compile TypeScript to JavaScript
# ============================================================
FROM node:22-alpine AS builder

# Start from the official Node 22 image based on Alpine Linux (tiny, ~50MB). The AS builder names this stage so we can reference it later.

WORKDIR /app

# 	Set /app as the working directory

COPY package*.json ./
# Copy package.json and package-lock.json to the container. This allows us to install dependencies in the next step.
RUN npm ci  
# 	Install all dependencies (including dev deps — we need TypeScript to compile).
COPY tsconfig.json ./
# Copy the TypeScript configuration file to the container.
COPY src ./src
# Copy the entire src directory (which contains our TypeScript source code) to the container.
RUN npm run build
# Run the build script defined in package.json, which compiles TypeScript to JavaScript and outputs it to the dist directory.

# ============================================================
# Stage 2 — "runtime": tiny image with ONLY what we need to run
# ============================================================
FROM node:22-alpine
# Start a new stage from the same base image. This stage will be much smaller since it won't include all the build tools and source code.
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev
# Reach into Stage 1 and grab only the compiled dist/ folder. The TypeScript source never makes it into the final image.
COPY --from=builder /app/dist ./dist
COPY public ./public
COPY views ./views

EXPOSE 5000

CMD ["node", "dist/server.js"]


# Stage 1 has TypeScript, dev deps, source code → ~400 MB
# Stage 2 has only compiled JS + production deps → ~150 MB