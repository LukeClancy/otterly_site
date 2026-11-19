# Updating the base image:
# 1. There are a lot of docker images under elixir. First [check what version of elixir you want](https://github.com/elixir-lang/elixir/releases). Then under https://hub.docker.com/r/hexpm/elixir/tags add that in the search box. Then find the erlang version you want.[Use hexdocs documentation, make sure its on the correct version](https://elixir.hexdocs.pm/1.20.3/compatibility-and-deprecations.html), there is a compatibility chart. [See erlang minor version](https://github.com/erlang/otp/releases)
# 2. The docs in that second link note that all Elixir v1 releases are backwards compatible, so theres no good reason to stay on an old version. Erlang is lower down than we would deal with.
# 3. Final search string: `1.20.3-erlang-29.0.5-alpine`, final resulting tag: `1.20.3-erlang-29.0.5-alpine-3.24.1`.
#
# - the files are not in here on first build pass, they come in on a bind mount. Good for when you care more about devops and less about passing around an easily executable docker image.

FROM hexpm/elixir:1.20.3-erlang-29.0.5-alpine-3.24.1 AS base

RUN apk add --no-cache build-base git bash inotify-tools nodejs npm nano curl
WORKDIR /app
RUN mix local.hex --force && mix local.rebar --force
EXPOSE 4000

FROM base AS development
CMD ["vm/utils/serve", "development"]

FROM base AS production
COPY . .
RUN MIX_ENV=prod mix setup
RUN MIX_ENV=prod mix compile
CMD ["vm/utils/serve", "production"]
