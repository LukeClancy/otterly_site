import Config

# Note we also include the path to a cache manifest
# containing the digested version of static files. This
# manifest is generated by the `mix assets.deploy` task,
# which you should run after static files are built and
# before starting your production server.
config :otterly, AppWeb.Endpoint, cache_static_manifest: "priv/static/cache_manifest.json"

# Do not print debug messages in production
config :logger, level: :info

# Runtime production configuration, including reading
# of environment variables, is done on config/runtime.exs.

config :otterly, Repo,
  database: "default",
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  # OR use a URL to connect instead
  url: "postgres://postgres:postgres@localhost/ecto_simple"

config :otterly, OtterlyWeb.Endpoint,
  # Binding to loopback ipv4 address prevents access from other machines.
  # Change to `ip: {0, 0, 0, 0}` to allow access from other machines.
  #
  https: [
    port: 4001,
    cipher_suite: :strong,
    keyfile: "/home/luke/selfsigned_key.pem",
    certfile: "/home/luke/otterly_site/priv/cert/selfsigned.pem"
  ],
  check_origin: false,
  code_reloader: false,
  debug_errors: false,
  secret_key_base: System.get_env("SECRET_KEY_BASE")

# Enable dev routes for dashboard and mailbox
config :otterly, dev_routes: false
