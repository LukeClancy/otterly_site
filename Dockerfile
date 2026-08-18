FROM hexpm/elixir:1.20.3-erlang-29.0.5-alpine-3.24.1 AS base

RUN apk add --no-cache build-base git bash sops

WORKDIR /app
RUN mix local.hex --force && mix local.rebar --force
EXPOSE 4000

# Checkpoint for a shell before mix.exs/mix.lock are even copied in -
# `run premix` for touching deps (eg. mix deps.update --all) by hand.
# FROM base AS premix
# RUN source vm/utils/yaml_parsing.shell
# RUN decrypt_env development

# FROM base AS development
# ENV MIX_ENV=dev
# RUN mix deps.get
# RUN mix deps.compile
# RUN source vm/utils/yaml_parsing.sh
# RUN decrypt_env development
# CMD exec mix phx.server

# FROM base AS production
# ENV MIX_ENV=prod
# COPY . .
# RUN mix deps.compile --only prod
# RUN mix compile
# RUN source vm/utils/yaml_parsing.sh && decrypt_env production
# CMD exec mix phx.server
