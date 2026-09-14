# Docker Server

This docker compose.yaml starts up just the elixir website as there is no database or jobs that need to be run.

caddy will be maintained externally for now, maybe config can be shared at some point. But there should be a single instance.

Warning: some of this was generated with claude. Not vibe-coded but pretty close

## Day-to-day Work

One of the goals here is to not have to install anything locally on your computer other than docker / docker desktop, and the credential software. As such all development and tests go through docker.

### Accessing VM

1. install docker & docker desktop, start the systemctl service.
2. add the "Remote Development" extension to vs-code
3. ctrl+shift+p -> open in remote container

### Pushing to production

see under vm/utils/push_production.sh
- needs to be run outside a dev container
- need tailscale access to cachyserver
- server needs a publicly accessible port, see cloudflare tunnels
- server needs a tailscale accessible (not public) docker registry.
  - Add `"insecure-registries": ["cachyserver:5000"]` into docker's daemon.json. For me this was in ~/.docker but might also be in /etc/docker. At some point we may want to update out of "insecure", but the port should only be over tailscale so I am not too worried.
  - list images on the registry: http://cachyserver:5000/v2/_catalog or use utils/list_images.sh which claude spat out
  - Garbage collect: do after pushing - `docker exec -it -u root lukes_registry bin/registry garbage-collect --delete-untagged /etc/docker/registry/config.yml` This should delete previous images as only 1 combo of tags allowed at a time (I think, something like that) [link](https://stackoverflow.com/questions/45046752/docker-registry-garbage-collection)

## Updating Docker Image

There are a lot of docker images under elixir. First [check what version of elixir you want](https://github.com/elixir-lang/elixir/releases). Then under https://hub.docker.com/r/hexpm/elixir/tags add that in the search box. Then find the erlang version you want.[Use hexdocs documentation, make sure its on the correct version](https://elixir.hexdocs.pm/1.20.3/compatibility-and-deprecations.html), there is a compatibility chart. [See erlang minor version](https://github.com/erlang/otp/releases)

The docs in that second link note that all Elixir v1 releases are backwards compatible, so theres no good reason to stay on an old version. Erlang is lower down than we would deal with.

Final search string: `1.20.3-erlang-29.0.5-alpine`, final resulting tag: `1.20.3-erlang-29.0.5-alpine-3.24.1`.

I am not yet sure how this interacts with mix.

## Credentials

The reason I chose sops is due to the fact it keeps yaml/json keys visible so you can see what changed in a PR. This process also removes credential encryption from the web framework and brings it up to a docker responsibility which is useful in ways. (For example, you don't have to have ruby installed for access, only sops)

### Creating your own key

Credentials are encrypted with [sops](https://getsops.io/docs/usage/key-management/#using-sops-yaml-conf-to-select-kms-pgp-for-new-files) and [age](https://github.com/filosottile/age). Attempted PGP but gave up on that since it didn't work with the keymanager which is kind of the whole point imo.

```bash
# output folder matters
touch ~/.config/sops/age/keys.txt
age_keygen >> keys.txt
age_keygen >> keys.txt
```

Once you have completed the above, go to .sops.yaml and add the public keys into the appropriate locations. Add yourself to the list as well so we can keep track of who owns what key.

### Revoking access to someone

Remove their public key from ~/.sops.yaml and then regenerate the credentials. Should probably make a script in ./utils when it actually happens. This won't revoke access to previous information they may already have.

### Editing credentials

```
  sops edit [file]
```

### Encryption/Decryption of a new file
 - `sops encrypt/decrypt -i [FILE]`
