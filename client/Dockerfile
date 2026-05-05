# ============================================================
# Stage 1 — build the React app
# ============================================================
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# At build time, Vite bakes VITE_* env vars into the bundle.
# We pass it as a build arg so we can override per-environment.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ============================================================
# Stage 2 — serve the built files with nginx
# ============================================================
FROM nginx:alpine

# Replace nginx's default config with ours
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the builder stage
# nginx serves files from /usr/share/nginx/html by default
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx's default command runs as a background daemon, but
# Docker containers must run a foreground process or they exit.
# "daemon off;" forces nginx to stay in the foreground.
CMD ["nginx", "-g", "daemon off;"]