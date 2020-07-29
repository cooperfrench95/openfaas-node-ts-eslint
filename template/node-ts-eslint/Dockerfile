ARG ARCH="amd64"
ARG WATCHDOG_VERSION="0.7.7"
ARG NODE_VERSION=12-alpine
FROM riggerthegeek/openfaas-watchdog:of-${WATCHDOG_VERSION}-${ARCH} AS watchdog

FROM ${ARCH}/node:${NODE_VERSION} as builder
WORKDIR /opt/app
COPY . .
RUN npm i
WORKDIR /opt/app/function
COPY function .
RUN npm i
WORKDIR /opt/app
RUN npm run build \
  && cp -Rf node_modules ./dist \
  && cp -Rf function/node_modules ./dist/function \
  && cp function/package.json ./dist/function \
  && cp function/package-lock.json ./dist/function \
  && (cd ./dist && npm prune --production) \
  && (cd ./dist/function && npm prune --production || true)

FROM ${ARCH}/node:${NODE_VERSION}
WORKDIR /opt/app
COPY --from=watchdog /opt/app/fwatchdog /usr/bin/fwatchdog
COPY --from=builder /opt/app/dist .
ENV NPM_CONFIG_LOGLEVEL warn
ENV cgi_headers="true"
ENV fprocess="node index.js"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"
USER node
HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1
CMD ["fwatchdog"]
