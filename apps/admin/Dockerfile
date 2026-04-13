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
ARG VITE_AUTHORITY
ARG VITE_CLIENT_ID
ARG VITE_REDIRECT_URI
ARG VITE_SILENT_REDIRECT_URI
ARG VITE_SCOPE=openid profile email
ARG VITE_GRAPHQL_ENDPOINT
ARG VITE_PANEL_URL

ENV VITE_BASE_PATH=${VITE_BASE_PATH}
ENV VITE_AUTHORITY=${VITE_AUTHORITY}
ENV VITE_CLIENT_ID=${VITE_CLIENT_ID}
ENV VITE_REDIRECT_URI=${VITE_REDIRECT_URI}
ENV VITE_SILENT_REDIRECT_URI=${VITE_SILENT_REDIRECT_URI}
ENV VITE_SCOPE=${VITE_SCOPE}
ENV VITE_GRAPHQL_ENDPOINT=${VITE_GRAPHQL_ENDPOINT}
ENV VITE_PANEL_URL=${VITE_PANEL_URL}

RUN yarn build

FROM nginx:1.27-alpine

RUN chown -R nginx:nginx /var/cache/nginx /var/log/nginx \
    && touch /run/nginx.pid && chown nginx:nginx /run/nginx.pid

COPY --from=builder --chown=nginx:nginx /app/apps/admin/dist /usr/share/nginx/html
COPY --chown=nginx:nginx apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
