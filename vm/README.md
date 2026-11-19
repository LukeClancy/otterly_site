# Docker Server

`vm/utils/` holds the generic scripts. Everything project-specific lives next
to them in `vm/`:

```
vm/
  utils/              shared scripts, see below
  README.md           this file
  vm.conf             serve_app(), test_app()
  Dockerfile          stages: base -> development / production.
                      Notes on updating the base image are at its top.
  docker-compose.yaml + docker-compose.{development,production}.yaml
  creds/{shared,development,test,production,other}.enc.yaml
  env/                decrypted creds, written by compose_config. Dont commit / put into an image.
  .env                compose configuration. Written by Komodo in production.
```

## Scripts

All anchor at the project root, so they work from anywhere.

| script | runs on | does |
|---|---|---|
| `compose_config <env>` | `compose_config` service (`sops.Dockerfile`) | runs before the app service. Mounts the repo and `$SOPS_AGE_KEY_FILE`, decrypts every `creds/*.enc.yaml` the key opens into `env/*` (`<group>shared` first, so env values override it). eg. env/development, env/pg_development |
| `serve <env>` | container | entrypoint: `serve_app` from vm.conf |
| `test` | host | `test_app` from vm.conf. Run before pushing |
| `check_sops_creds` | host | checks your keys open the creds they should |
| `get_private_key <env>` | host | finds the key in your keys.txt that opens `<env>`. Uses `$SOPS_AGE_KEY` instead if set (GitHub workflows) |
| `parse_yaml` | either | decrypted yaml -> `KEY="value"` lines |
| `unroot_files` | host | chowns the repo back to you after a container wrote files as root |

The app reads `vm/env/<env>` itself at runtime (eg. phoenix `config/runtime.exs`), never at build time. `vm/env` only exists once `compose_config` has run, which is after images are built.

## Day-to-day Work

Goals:
1. To not have to install anything locally on your computer other than docker and the credential software (sops + age). All development and tests go through docker.
2. Platform for future growth: sops has capabilities to integrate with external authentication sites.
3. Plugin to caddy: Have caddy on a server handling network traffic. See [this guide](https://github.com/DoTheEvo/selfhosted-apps-docker/tree/master/caddy_v2)
4. Github: actions and AI involvment in the development process
5. Komodo DevOps for CI/CD

### Development vs production

- **development**: the repo is bind mounted to `/app`, so edits show up live. `serve_app` runs setup on boot.
- **production**: the repo is copied into the image and setup + compile run at build time. Only `vm/env` is mounted (read only). Code changes need a rebuild, a restart is not enough.

### Accessing VM

1. install docker engine with the compose, then start it. eg. on arch: `sudo pacman -S docker docker-compose && sudo systemctl enable --now docker`. Check with `docker compose version`.
   - add yourself to the docker group so vs-code can reach it: `sudo usermod -aG docker $USER`, then log out and in.
   - don't use docker desktop. It runs its own daemon inside a VM, and there are weird performance and compat issues. On windows maybe idk.
2. add the "Remote Development" extension to vs-code
3. ctrl+shift+p -> open in remote container

### Pushing to production

Deploys go through [Komodo](https://komo.do) as a stack on a git webhook. Push to the stack's branch and it redeploys. Stack setup:

- **Run directory**: `vm`, compose files `docker-compose.yaml` + `docker-compose.production.yaml`
- **Environment**: written to `vm/.env`. Mark anything secret as a Komodo secret so it is redacted from deploy logs.
- **Decrypt**: add SOPS_AGE_KEY into komodo stack
- **Pre deploy**: `git submodule update --recursive --checkout --init`
- **Up extra args**: `--build`. Without it compose reuses the old image and the site never updates. Check the Compose Up stage in the deploy log ends in `up -d --build`.
- **Post deploy**: `docker container rm <project>_compose_config`


## Credentials

The reason I chose [sops](https://getsops.io/docs/usage/key-management/#using-sops-yaml-conf-to-select-kms-pgp-for-new-files) is due to the fact it keeps yaml/json keys visible so you can see what changed in a PR. This process also removes credential encryption from the web framework and brings it up to a docker responsibility which is useful in its portability.

### Creating your own key

Credentials are encrypted with sops/[age](https://github.com/filosottile/age). Attempted PGP but gave up on that since it didn't work with the keymanager which is kind of the whole point.

```bash
# output folder matters
mkdir -p ~/.config/sops/age
age-keygen >> ~/.config/sops/age/keys.txt  # development
age-keygen >> ~/.config/sops/age/keys.txt  # production
```

Once you have completed the above, go to the project's `.sops.yaml` and add the public keys into the appropriate locations. Add yourself to the list as well so we can keep track of who owns what key.

Then do `sops updatekeys vm/creds/*` and check with `./vm/utils/check_sops_creds`.

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

See vm.conf. Example:

```
# called by vm/utils/serve inside the container. $1 is the project env.
# phoenix reads its own creds in config/runtime.exs.
serve_app() {
	case "$1" in
		development) export MIX_ENV=dev && mix setup ;;
		production) export MIX_ENV=prod ;;
		*) export MIX_ENV="$1" ;;
	esac
	mix phx.server
}

test_app(){
    docker compose -f ./docker-compose.yaml -f ./docker-compose.development.yaml run --rm otterly sh -c "mix deps.get && mix test"
}
```