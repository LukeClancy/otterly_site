FROM hexpm/elixir:1.20.3-erlang-29.0.5-alpine-3.24.1 AS base

RUN apk add --no-cache build-base git bash inotify-tools nodejs npm nano curl
# apk's sops (3.12.2) fails to decrypt some files a newer sops writes -
# pin to match what's used on dev machines.
RUN curl -fsSL https://github.com/getsops/sops/releases/download/v3.13.3/sops-v3.13.3.linux.amd64 -o /usr/local/bin/sops \
	&& chmod +x /usr/local/bin/sops

WORKDIR /app
COPY . .
RUN mix local.hex --force && mix local.rebar --force
EXPOSE 4000

# Checkpoint for a shell before mix.exs/mix.lock are even copied in -
# `run premix` for touching deps (eg. mix deps.update --all) by hand.
# RUN vm/utils/export_env development

FROM base AS premix
FROM base AS development
# install claude
RUN curl -fsSL https://claude.ai/install.sh | bash
RUN mix deps.get
CMD ["vm/utils/serve", "development"]

FROM base AS production
RUN mix deps.get
CMD ["vm/utils/serve", "production"]
