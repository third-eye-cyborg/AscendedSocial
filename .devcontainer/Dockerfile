FROM mcr.microsoft.com/devcontainers/typescript-node:20-bullseye

# Install additional development tools
RUN apt-get update && apt-get install -y \
    postgresql-client \
    sqlite3 \
    ffmpeg \
    imagemagick \
    webp \
    jq \
    gh \
    git-lfs \
    && rm -rf /var/lib/apt/lists/*

# Install global npm packages
RUN npm install -g \
    pnpm \
    yarn \
    @nestjs/cli \
    @angular/cli \
    typescript \
    ts-node \
    dotenv-cli \
    concurrently \
    wait-on

# Copy scripts
COPY .devcontainer/init.sh /usr/local/bin/init.sh
RUN chmod +x /usr/local/bin/init.sh

# Create directories for logs
RUN mkdir -p /workspace/logs && chmod 777 /workspace/logs

USER node
