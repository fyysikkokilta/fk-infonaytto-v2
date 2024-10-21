FROM oven/bun:latest as base
WORKDIR /app

FROM base as install
RUN mkdir -p /temp/prod
COPY ./package.json ./bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY server.ts server.ts
COPY src src
COPY package.json package.json
COPY public public

EXPOSE 3010/tcp
ENTRYPOINT [ "bun", "run", "server.ts" ]