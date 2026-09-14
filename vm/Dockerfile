FROM hexpm/elixir:1.20.3-erlang-29.0.5-alpine-3.24.1 AS base

RUN apk add --no-cache build-base git bash sops inotify-tools nodejs npm nano

WORKDIR /app
COPY . .
RUN mix local.hex --force && mix local.rebar --force
EXPOSE 4000

# Checkpoint for a shell before mix.exs/mix.lock are even copied in -
# `run premix` for touching deps (eg. mix deps.update --all) by hand.
# RUN source vm/utils/yaml_parsing.shell
# RUN decrypt_env development

FROM base AS premix
FROM base AS development
RUN mix deps.get
CMD mix phx.server

FROM base AS production
ENV MIX_ENV=prod
RUN mix deps.get
CMD mix phx.server