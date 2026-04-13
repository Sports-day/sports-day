# build context = project root (.)
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/admin/package.json apps/admin/package.json
COPY apps/panel/package.json apps/panel/package.json
COPY apps/form/package.json apps/form/package.json

RUN yarn install --frozen-lockfile

WORKDIR /app/apps/admin
COPY apps/admin/ .

ARG VITE_BASE_PATH=/admin/
ENV VITE_BASE_PATH=${VITE_BASE_PATH}

RUN yarn build

FROM nginx:1.27-alpine

RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx \
    && touch /run/nginx.pid && chown nginx:nginx /run/nginx.pid

COPY --from=builder --chown=nginx:nginx /app/apps/admin/dist /usr/share/nginx/html
COPY --chown=nginx:nginx apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
