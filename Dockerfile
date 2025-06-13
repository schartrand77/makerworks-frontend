# === STAGE 1: Build the app ===
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

# Install deps and build
RUN npm install && npm run build

# === STAGE 2: Serve with Brotli-enabled NGINX ===
FROM anigeo/nginx-brotli:latest

ENV NODE_ENV=production

# Copy built app to NGINX
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy NGINX config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Optional: Ensure service worker and manifest are present
# COPY ./public/manifest.webmanifest /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/index.html || exit 1