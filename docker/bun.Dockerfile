# Base image
FROM oven/bun:slim AS base

# Install node_modules
FROM base AS install
WORKDIR /app
COPY package.json bun.lock ./
RUN bun i --frozen-lockfile --production

# Build single executable js file
FROM base AS build
WORKDIR /app
COPY . .
COPY --from=install /app/node_modules/ ./node_modules/
RUN bun run build

# Production stage
FROM base AS production
WORKDIR /bin
ENV NODE_ENV=production
COPY --from=build /app/build/ ./
EXPOSE 3000/tcp
CMD [ "run", "/bin/index.js" ]