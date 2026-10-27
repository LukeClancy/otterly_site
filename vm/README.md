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

## Scripts

All anchor at the project root, so they work from anywhere.

| script | runs on | does |
|---|---|---|
| `compose_config` | host | writes `vm/.access_info` (SOPS_AGE_KEY + PROJECT_ENV, given to containers) and `vm/.env` (decrypted creds, for containers without these scripts) |
| `serve <env>` | container | entrypoint: puts the access state in .bashrc/.profile, then `serve_app` from deploy.conf |
| `get_environment_config <env>` | either | decrypted shared + `<env>` creds as `KEY="value"` lines. The app calls this itself (rails `config/environment.rb`, phoenix `config/config.exs`) so any shell can pick its env, eg. tests |
| `push_production` | host | build, push to the registry, copy compose files, `PRE_UP`, `up -d` |
| `test_sops_creds` | host | checks your keys open the creds they should |
| `get_private_key <env>` | host | finds the key in your keys.txt that opens `<env>` |
| `docker_stat` | host | registry images + server containers |

## Day-to-day Work

Goals:
1. To not have to install anything locally on your computer other than docker and the credential software (sops + age). As such all development and tests go through docker.
2. Platform for future growth: sops has capabilities to integrate with external authentication sites.
3. Plugin to caddy: Have caddy on a server handling network traffic. See docker-compose.production.yaml and [this guide](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/caddy_v2)
4. Github: actions and AI involvment in the development process

### Accessing VM

Note there was a section on buildx here but I don't think we use that

1. install docker engine with the compose, then start it. eg. on arch: `sudo pacman -S docker docker-compose && sudo systemctl enable --now docker`. Check with `docker compose version`.
   - add yourself to the docker group so vs-code can reach it: `sudo usermod -aG docker $USER`, then log out and in.
   - don't use docker desktop. It runs its own daemon inside a VM, and there are weird performance and compat issues. On windows maybe idk.
2. add the "Remote Development" extension to vs-code
3. ctrl+shift+p -> open in remote container

### Pushing to production

`./utils/push_production`
- run outside dev container
- need access to `$SERVER`
- need to login to the registry `docker login $REGISTRY` (ask someone for access)
- list images on the registry: `./utils/docker_stat`
- Garbage collect: `docker exec -it -u root $REGISTRY bin/registry garbage-collect --delete-untagged /etc/docker/registry/config.yml` This should delete previous images as only 1 combo of tags allowed at a time (I think, something like that) [link](https://stackoverflow.com/questions/45046752/docker-registry-garbage-collection)

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

### Config

**(Things below here are mainly for initial setup or issues)**

See deploy.conf. Example:

```
# remote dir is /root/$PROJECT
PROJECT=otterly_site
SERVER=cachyserver
REGISTRY="https://registry.otterlyjs.org"

# optional, run on the server before `docker compose up -d`. Migrations etc
PRE_UP=""

# called by vm/utils/serve inside the container. $1 is the project env.
# phoenix decrypts its own creds in config/config.exs.
serve_app() {
	case "$1" in
		development) export MIX_ENV=dev ;;
		production) export MIX_ENV=prod ;;
		*) export MIX_ENV="$1" ;;
	esac
	exec mix phx.server
}
```

### Troubleshooting

tailscale not connecting over regular ssh - think its due to routing locally - add this to ~/.ssh/config:
```
Host <hostname from tailscale status>
  HostName <ip from tailscale status>
  ConnectTimeout 5
```

### TODO
Just a "This isn't perfectly configured and figured out". Writing so I can break out of working on this thing and get to making actual money.
	- otterly_site directory != otterly service mismatch. IDK probably not worth changing. Think thats one too many env variables
	- .env file should just have compose configuration. Another file .project_env should contain the environment specific things. There should be service-specific env files (yeesh)
  - think `tailscale ssh` is littered everywhere which we no longer need due to hostname file
  - network name should be in deploy.conf instead of just being "caddy"
  - should probably at least have pointers for how to do devcontainers
  - ...and still haven't done github actions