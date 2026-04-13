# build context = project root (.)
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/admin/package.json apps/admin/package.json
COPY apps/panel/package.json apps/panel/package.json
COPY apps/form/package.json apps/form/package.json

RUN yarn install --frozen-lockfile

WORKDIR /app/apps/panel
COPY apps/panel/ .

ARG VITE_BASE_PATH=/
ENV VITE_BASE_PATH=${VITE_BASE_PATH}

RUN yarn build

FROM nginx:1.27-alpine

RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx \
    && touch /run/nginx.pid && chown nginx:nginx /run/nginx.pid

COPY --from=builder --chown=nginx:nginx /app/apps/panel/dist /usr/share/nginx/html
COPY --chown=nginx:nginx apps/panel/nginx.conf /etc/nginx/conf.d/default.conf

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
