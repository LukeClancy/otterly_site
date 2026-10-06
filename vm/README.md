# Docker Server

Shared between projects: `vm/utils/` and this README must stay identical in
every project (`~/Projects/stable_deploy` checks). Everything project-specific
lives next to them in `vm/`:

```
vm/
  utils/              shared scripts, see below
  README.md           this file, shared
  deploy.conf         PROJECT, SERVER, PRE_UP, serve_app()
  Dockerfile          stages: base -> premix -> (deps) -> development / production.
                      Notes on updating the base image are at its top.
  docker-compose.yaml + docker-compose.development.yaml
  creds/{shared,development,test,production}.enc.yaml
```

caddy will be maintained externally for now, maybe config can be shared at some point. But there should be a single instance.

Warning: some of this was generated with claude. Not vibe-coded but pretty close

## Scripts

All anchor at the project root, so they work from anywhere.

| script | runs on | does |
|---|---|---|
| `set_access_state` | host | writes `vm/.access_info` (SOPS_AGE_KEY + PROJECT_ENV, given to containers) and `vm/.env` (decrypted creds, for containers without these scripts) |
| `serve <env>` | container | entrypoint: puts the access state in .bashrc/.profile, then `serve_app` from deploy.conf |
| `get_environment_config <env>` | either | decrypted shared + `<env>` creds as `KEY="value"` lines. The app calls this itself (rails `config/environment.rb`, phoenix `config/config.exs`) so any shell can pick its env, eg. tests |
| `push_production` | host | build, push to the registry, copy compose files, `PRE_UP`, `up -d` |
| `test_sops_creds` | host | checks your keys open the creds they should |
| `get_private_key <env>` | host | finds the key in your keys.txt that opens `<env>` |
| `docker_stat` | host | registry images + server containers |

## Day-to-day Work

One of the goals here is to not have to install anything locally on your computer other than docker and the credential software (sops + age). As such all development and tests go through docker.

### Accessing VM

1. install docker engine with the compose and buildx plugins, then start it. eg. on arch: `sudo pacman -S docker docker-compose docker-buildx && sudo systemctl enable --now docker`, on debian/ubuntu follow https://docs.docker.com/engine/install/. Check with `docker compose version`.
   - add yourself to the docker group so vs-code can reach it: `sudo usermod -aG docker $USER`, then log out and in.
   - don't use docker desktop on linux. It runs its own daemon inside a VM, separate from the engine above, so you end up with two sets of images/containers and config (eg. insecure-registries below) in two places. On windows/mac it is the only option.
2. add the "Remote Development" extension to vs-code
3. ctrl+shift+p -> open in remote container

### Pushing to production

`vm/utils/push_production`
- needs to be run outside a dev container
- need tailscale access to `$SERVER`
- server needs a publicly accessible port, see cloudflare tunnels
- server needs a tailscale accessible (not public) docker registry.
  - Add `"insecure-registries": ["cachyserver:5000"]` into docker's daemon.json. For me this was in ~/.docker but might also be in /etc/docker. At some point we may want to update out of "insecure", but the port should only be over tailscale so I am not too worried.
  - list images on the registry: http://cachyserver:5000/v2/_catalog or `docker_stat`
  - Garbage collect: do after pushing - `docker exec -it -u root lukes_registry bin/registry garbage-collect --delete-untagged /etc/docker/registry/config.yml` This should delete previous images as only 1 combo of tags allowed at a time (I think, something like that) [link](https://stackoverflow.com/questions/45046752/docker-registry-garbage-collection)

## Credentials

The reason I chose sops is due to the fact it keeps yaml/json keys visible so you can see what changed in a PR. This process also removes credential encryption from the web framework and brings it up to a docker responsibility which is useful in ways. (For example, you don't have to have ruby installed for access, only sops)

### Creating your own key

Credentials are encrypted with [sops](https://getsops.io/docs/usage/key-management/#using-sops-yaml-conf-to-select-kms-pgp-for-new-files) and [age](https://github.com/filosottile/age). Attempted PGP but gave up on that since it didn't work with the keymanager which is kind of the whole point imo.

```bash
# output folder matters
mkdir -p ~/.config/sops/age
age-keygen >> ~/.config/sops/age/keys.txt  # development
age-keygen >> ~/.config/sops/age/keys.txt  # production
```

Once you have completed the above, go to the project's .sops.yaml and add the public keys into the appropriate locations. Add yourself to the list as well so we can keep track of who owns what key.

### Revoking access to someone

Remove their public key from .sops.yaml and then regenerate the credentials (`sops updatekeys`), and rotate the secrets themselves. This won't revoke access to previous information they may already have.

### Editing credentials

```
  sops edit [file]
```

### Encryption/Decryption of a new file
 - `sops encrypt/decrypt -i [FILE]`
