# Multi-stage: build then production run for a single app
# Build: docker build -f docker/Dockerfile --build-arg APP_NAME=auth-service -t auth-service .
# Run: docker run -e DATABASE_URL=... auth-service

ARG APP_NAME
FROM node:22-alpine AS builder

WORKDIR /app

COPY . .

RUN npm ci || npm install

ARG APP_NAME
RUN npx nx build ${APP_NAME} --skip-nx-cache

# Point libs' main to built output so Node can require() them at runtime
RUN for f in packages/libs/*/package.json; do \
  d=$$(dirname "$$f"); \
  if [ -f "$$d/dist/index.js" ]; then \
  sed -i 's|"main": *"[^"]*"|"main": "./dist/index.js"|' "$$f"; fi; done

FROM node:22-alpine AS runner

RUN apk add --no-cache curl

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./
COPY packages/ packages/
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/dist dist

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

CMD node dist/packages/apps/${APP_NAME}/main.js
