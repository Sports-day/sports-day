FROM node:18.20.0 AS Builder

WORKDIR /app

# fetch packages
COPY package*.json ./
COPY yarn.lock ./
RUN yarn

FROM node:18.20.0-alpine AS Runner

WORKDIR /app

COPY --from=Builder /app/package.json ./
COPY --from=Builder /app/node_modules/ ./node_modules/

# copy files for build
COPY app/ ./app/
COPY components/ ./components/
COPY src/ ./src/
COPY public/ ./public/
COPY styles/ ./styles/
COPY types/ ./types/
COPY tsconfig.json .
COPY next.config.js .
COPY middleware.ts .

EXPOSE 3000

# Container volume mounts often miss fs events; polling keeps HMR stable.
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true

# Default to dev server for local development.
# Set NODE_ENV=production to use build/start behavior.
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then yarn build && yarn start; else yarn dev -H 0.0.0.0 -p 3000; fi"]
