# --- Stage 1: Build the frontend ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy and install dependencies (handle missing lock file)
COPY package*.json ./
RUN npm ci || npm install

# Copy source
COPY . .

# Build Vite production output
RUN npm run build

# --- Stage 2: Serve with NGINX ---
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Optional: clean default site
RUN rm -rf ./*

# Copy built frontend
COPY --from=builder /app/dist .

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]