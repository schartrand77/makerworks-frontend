### STAGE 1: Build with Vite
FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

# ⛔ Temporarily omit NODE_ENV=production to ensure Vite is available
RUN npm install && npm run build


### STAGE 2: Serve with NGINX
FROM nginx:stable AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./public/nginx.conf /etc/nginx/conf.d/default.conf

# ✅ Now set production environment here
ENV NODE_ENV=production
RUN sed -i 's|access_log .*;|access_log /dev/stdout;|' /etc/nginx/nginx.conf

EXPOSE 80