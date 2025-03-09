# Base image
FROM oven/bun:slim AS base

# Install node_modules
FROM base AS install
WORKDIR /app
COPY package.json bun.lock ./
RUN bun i --frozen-lockfile --production

# Build single executable file
FROM base AS build
WORKDIR /app
COPY . .
COPY --from=install /app/node_modules/ ./node_modules/
RUN bun run compile

# Production stage
FROM gcr.io/distroless/base-debian12:nonroot AS production
WORKDIR /bin
COPY --from=build --chown=nonroot:nonroot /app/build .
EXPOSE 3000/tcp
CMD [ "/bin/app" ]