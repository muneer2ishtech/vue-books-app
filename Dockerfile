# syntax=docker/dockerfile:1
# Pin BuildKit's Dockerfile frontend: https://docs.docker.com/reference/dockerfile/#syntax

# node:24-bookworm-slim — Debian Bookworm, glibc-based; smaller than full Node, fewer musl surprises than Alpine.
FROM node:24-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./

ARG BUILD_ENV=production

# Normalize BUILD_ENV to a consistent format
RUN set -eu; \
  echo "ARG BUILD_ENV=${BUILD_ENV}"; \
  build_env="$(printf '%s' "${BUILD_ENV}" | tr '[:upper:]' '[:lower:]')"; \
  case "${build_env}" in \
    dev) build_env="development" ;; \
    prod) build_env="production" ;; \
  esac; \
  echo "build_env: ${build_env}"; \
  echo "${build_env}" > /tmp/build_env

# Extract version from package.json and add env name as suffix for non production
RUN set -eu; \
  APP_VERSION="$(node -p "require('./package.json').version")"; \
  build_env="$(cat /tmp/build_env)"; \
  if [ ! "${build_env}" = "production" ]; then \
    APP_VERSION="${APP_VERSION}-${build_env}"; \
  fi; \
  echo "APP_VERSION: ${APP_VERSION}"; \
  echo "${APP_VERSION}" > /tmp/app_version

ARG FRESH_INSTALL=false

# non-production + FRESH_INSTALL=true remove lock file and do npm install
# deps: production → npm ci only; FRESH_INSTALL=true forbidden for production.
RUN set -eu; \
  build_env="$(cat /tmp/build_env)"; \
  echo "ARG FRESH_INSTALL=${FRESH_INSTALL}"; \
  fresh_install="$(printf '%s' "${FRESH_INSTALL}" | tr '[:upper:]' '[:lower:]')"; \
  case "${fresh_install}" in \
    true|false) ;; *) \
    echo "error: FRESH_INSTALL must be true or false (got: ${FRESH_INSTALL})" >&2; exit 1 ;; \
  esac; \
  if [ "${fresh_install}" = "true" ]; then \
    if [ "${build_env}" = "production" ]; then \
      echo "error: FRESH_INSTALL=true is not allowed for production" >&2; exit 1; \
    fi; \
    echo "Running npm install after deleting lockfile to resolve versions"; \
    rm -f package-lock.json; \
    npm install; \
  else \
    echo "Running npm ci to ensure versions from lockfile"; \
    npm ci; \
  fi

COPY . .

# Ensure required environment config files exist before building
RUN set -eu; \
  build_env="$(cat /tmp/build_env)"; \
  if [ ! -f ".env.${build_env}" ] && [ ! -f ".env.${build_env}.local" ]; then \
    echo "error: missing .env.${build_env} or .env.${build_env}.local" >&2; exit 1; \
  fi

# Build the Vue app with the detected environment mode
RUN set -eu; \
  build_env="$(cat /tmp/build_env)"; \
  npm run build -- --mode "${build_env}"

# Runtime stage - nginx serves the built Vue app
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /tmp/build_env /tmp/build_env
COPY --from=build /tmp/app_version /tmp/app_version

LABEL org.opencontainers.image.title="vue-books-app"

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
