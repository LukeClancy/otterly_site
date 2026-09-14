import Config

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we can use it
# to bundle .js and .css sources.

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Watch static and templates for browser reloading.
config :otterly, OtterlyWeb.Endpoint,
  live_reload: [
    patterns: [
      ~r"priv/static/(?!uploads/).*",
      ~r"priv/gettext/.*(po)$",
      ~r"lib/otterly_web/controllers/.*_html.(ex|exs)$",
      ~r"lib/otterly_web/components/.*.(ex|exs)$",
      ~r"lib/otterly_web/components/layouts/.*$"
    ]
  ]

config :otterly, OtterlyWeb.Endpoint,
  # Bind to all interfaces so the port mapping in vm/docker-compose.yaml
  # can actually reach the app from the host.
  http: [ip: {0, 0, 0, 0}, port: 4000],
  check_origin: false,
  code_reloader: true,
  debug_errors: true,
  secret_key_base: System.get_env("SECRET_KEY_BASE"),
  watchers: [
    # see config.exs and the /deps folder, also deps/esbuild/lib/esbuild.ex
    # config_name: {dep module, dep module method, [config profile, additional code for our config profile]}
    tailwind: {Tailwind, :install_and_run, [:otterly, ~w(--watch)]},
    esbuild: {Esbuild, :install_and_run, [:otterly, ~w(--watch)]},
    # links assets/files/* into priv/static so `mix phx.server` alone (with
    # no separate `mix assets.deploy`) still serves images/favicon. Runs
    # once at boot and returns - Phoenix's watcher supervisor is `:transient`
    # so a watcher that finishes normally is left alone, not restarted.
    link_static: {Otterly.MixProject, :link_static_files, [nil]}
  ]

# config :otterly, Repo,
#   database: "default",
#   username: "postgres",
#   password: "postgres",
#   hostname: "localhost",
#   # OR use a URL to connect instead
#   url: "postgres://postgres:postgres@localhost/ecto_simple"

# Enable dev routes for dashboard and mailbox
config :otterly, dev_routes: true

# Initialize plugs at runtime for faster development compilation
config :phoenix, :plug_init_mode, :runtime

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Include HEEx debug annotations as HTML comments in rendered markup
config :phoenix_live_view, :debug_heex_annotations, true
