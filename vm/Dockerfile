# Updating the base image
#
# There are a lot of docker images under elixir. First [check what version of elixir you want](https://github.com/elixir-lang/elixir/releases). Then under https://hub.docker.com/r/hexpm/elixir/tags add that in the search box. Then find the erlang version you want.[Use hexdocs documentation, make sure its on the correct version](https://elixir.hexdocs.pm/1.20.3/compatibility-and-deprecations.html), there is a compatibility chart. [See erlang minor version](https://github.com/erlang/otp/releases)
#
# The docs in that second link note that all Elixir v1 releases are backwards compatible, so theres no good reason to stay on an old version. Erlang is lower down than we would deal with.
#
# Final search string: `1.20.3-erlang-29.0.5-alpine`, final resulting tag: `1.20.3-erlang-29.0.5-alpine-3.24.1`.
#
# I am not yet sure how this interacts with mix.

FROM hexpm/elixir:1.20.3-erlang-29.0.5-alpine-3.24.1 AS base

RUN apk add --no-cache build-base git bash inotify-tools nodejs npm nano curl
# apk's sops (3.12.2) fails to decrypt some files a newer sops writes -
# pin to match what's used on dev machines.
RUN curl -fsSL https://github.com/getsops/sops/releases/download/v3.13.3/sops-v3.13.3.linux.amd64 -o /usr/local/bin/sops \
	&& chmod +x /usr/local/bin/sops

WORKDIR /app
RUN mix local.hex --force && mix local.rebar --force
EXPOSE 4000

# Checkpoint for a shell before the app is even copied in -
# `run premix` for touching deps (eg. mix deps.update --all) by hand.
FROM base AS premix
FROM base AS development
COPY . .
# install claude
RUN curl -fsSL https://claude.ai/install.sh | bash
RUN mix deps.get
CMD ["vm/utils/serve", "development"]

FROM base AS production
COPY . .
RUN mix deps.get
CMD ["vm/utils/serve", "production"]
