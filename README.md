# Otterly Site

Site for [otterly js](https://github.com/LukeClancy/otterly/tree/main) documentation. Takes markdown and file names from my [otterly npm package's docs folder](https://github.com/LukeClancy/otterly/tree/main/docs) and converts them into rich html documentation. Can be repurposed with some work for other projects.

My goal here is to work with elixir/phoenix, look into technologies for quick iteration, test out otterly js, and create a good docs site for future projects. I want to work in surrealdb at some point too, but there will be some integration work there at some point as it doesn't play nice yet with phoenix.

Once again, this website is:
- a testing ground for phoenix technologies
- a testing ground for quick and effective website development
- a docs site, that should be reusable with minimal effort

Tech:
- temple: Implemented, but I believe hex is a better option as hex seems quite usable, and temple is not compatible with various phoenix systems.
- bun: Quite good, super fast, still a few issues with it due to bugs. Main issue is CSS doesn't work with it yet. Thats not an issue with tailwind, but something to keep in mind. You do need custom code / settings (which I am coming to accept with bundlers) look at bundling.js. Its fine, but Im not sure its really worth it.
- elixir/phoenix: Settings are clear, documentation / syntax pops up real time, errors are obvious and mostly caught compile time.
- Tailwind: good for quick iteration.

### refresh the UA parsers
(Think this may be depreciated)
mix ua_inspector.download

## Development

Needs only docker, plus [sops](https://getsops.io) and [age](https://github.com/filosottile/age) on the host.

- Devcontainer: "Reopen in Container". `bin/devcontainer_init` runs first on the host and writes `./.env` (gitignored) with the development age key.
- Tests: `./bin/test` (host, CI or inside the devcontainer).
- Shell without the devcontainer: `docker compose run --rm otterly sh` (uses `COMPOSE_FILE` from `./.env`).

## Credentials

SOPS-encrypted dotenv files in `env/`. `shared.env` is loaded first, then the environment's own file overrides it.

| file | readable by |
|---|---|
| `env/shared.env` | development, production, CI, Sencho keys |
| `env/development.env`, `env/test.env` | development, CI keys |
| `env/production.env` | production, Sencho keys |

- Development/test: the app decrypts them itself (`config/config.exs` calls `bin/decrypt_env`), so a dev shell can run tests against `env/test.env`.
- Production: Sencho decrypts them with its git source age identity and passes them in through `env_file`.

```bash
sops edit env/development.env
# new key: append to ~/.config/sops/age/keys.txt, add the public key to .sops.yaml, then
sops updatekeys env/*.env
```

To revoke someone, remove their public key from `.sops.yaml`, run `sops updatekeys`, and rotate the secrets. They keep anything they already decrypted.

## Deployment (Sencho)

[Sencho](https://docs.sencho.io) builds the `production` target straight from this repo. There is no registry and no SSH.

1. In Sencho, add a stack from a git source: this repo, ref `main`, compose files `compose.yaml` then `compose.production.yaml`.
2. In the git source's Secrets tab, generate an age identity. Add its public key to the `shared` and `production` rules in `.sops.yaml`, then run `sops updatekeys env/shared.env env/production.env` and commit.
3. Set encrypted source policy to "Require SOPS encryption" and apply behavior to Auto-deploy.
4. Pick a deploy trigger:
   - CI (deploys only after tests pass): create a Sencho webhook for the stack with the "Git source sync" action. In GitHub, set repository variable `SENCHO_WEBHOOK_URL` (`https://<sencho>/api/webhooks/<id>/trigger`) and secret `SENCHO_WEBHOOK_SECRET`. `.github/workflows/test.yml` calls it after tests pass on `main`.
   - Or Settings → GitOps polling, which needs no inbound access to Sencho.

The `caddy` docker network must exist on the node.
