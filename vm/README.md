# Docker Server

This docker compose.yaml starts up:
  1. the elixir website
  2. a caddy server for figuring out ssh and https 

## Day-to-day Work

One of the goals here is to not have to install anything locally on your computer other than docker / docker desktop, and the credential software. As such all development and tests go through docker. Development and test bind-mount the project's file system into the container; production runs a prebuilt image pulled from a registry, no source on the VM at all.

under vm/bin you will see some premade scripts

dev: starts the dev otterly server (`docker compose -f compose.yaml -f compose.dev.yaml up`, bind-mounted source)
exec [cmd]: runs cmd inside the already-running otterly container (`docker compose exec`). Errors if nothing is running. No cmd drops to a shell.
run [env] [cmd]: runs cmd in a fresh one-off container for env (development/test/production, default development), no server started, container removed after. No cmd drops to a shell.
test [opts]: runs `mix test` in a fresh container, forwarding opts
prod [--start]: builds the production image and pushes it to the registry. With --start, also runs it (`docker compose up`)

## Updating Docker Image

There are a lot of docker images under elixir. First [check what version of elixir you want](https://github.com/elixir-lang/elixir/releases). Then under https://hub.docker.com/r/hexpm/elixir/tags add that in the search box. Then find the erlang version you want.[Use hexdocs documentation, make sure its on the correct version](https://elixir.hexdocs.pm/1.20.3/compatibility-and-deprecations.html), there is a compatibility chart. [See erlang minor version](https://github.com/erlang/otp/releases)

The docs in that second link note that all Elixir v1 releases are backwards compatible, so theres no good reason to stay on an old version. Erlang is lower down than we would deal with.

Final search string: `1.20.3-erlang-29.0.5-alpine`, final resulting tag: `1.20.3-erlang-29.0.5-alpine-3.24.1`.

I am not yet sure how this interacts with mix.

## Credentials

The reason I chose sops is due to the fact it keeps yaml/json keys visible so you can see what changed in a
PR. This process also removes credential encryption from the web framework and brings it up to a docker
responsibility which is useful in ways.

shared.yaml is not encrypted by design, and holds information like what versions of what we are installing.
This is just to reduce docker image creation time and seperate *actual* secrets from general config.

### Creating your own key

Credentials are encrypted with [sops](https://getsops.io/docs/usage/key-management/#using-sops-yaml-conf-to-select-kms-pgp-for-new-files) and [age](https://github.com/filosottile/age). Attempted PGP but gave up on that since it didn't work with the keymanager which is kind of the whole point imo.

```bash
# output folder matters
age-keygen -o ~/.config/sops/age/otterly/development.key
age-keygen -o ~/.config/sops/age/otterly/production.key
ln -s ~/.config/sops/age/otterly/development.key ~/.config/sops/age/otterly/test.key
```

Once you have completed the above, go to .sops.yaml and add the public keys into the appropriate locations,
adding yourself to the list as well so we can keep track of who owns what key.

### Revoking access to someone

Remove their public key from ~/.sops.yaml and then regenerate the credentials. Should probably make a script in ./utils when it actually happens. This won't revoke access to previous information they may already have.

### Editing credentials

```
  sops edit [file]
```

### Encryption/Decryption of a new file
 - `sops encrypt/decrypt -i [FILE]`
