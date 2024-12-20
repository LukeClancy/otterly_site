import Config

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we can use it
# to bundle .js and .css sources.


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
  http: [ip: {127, 0, 0, 1}, port: 4000],
  check_origin: false,
  code_reloader: true,
  debug_errors: true,
  secret_key_base: "Vpo/Io3lYHAvPK1uvfuBeuTwnF0B0isQRMU1bvDfhtwMzj/0w2mOiPMqAm3DgvfL",
  watchers: [
    #see config.exs and the /deps folder, also deps/bun/lib/bun.ex
    #config_name: {dep module, dep module method, [config profile, additional code for our config profile]}
    tailwind: {Tailwind, :install_and_run, [:otterly, ~w(--watch)]},
    bun: {Bun, :install_and_run, [:otterly, ~w(--watch)]}
  ]

# Watch static and templates for browser reloading.
config :otterly, AppWeb.Endpoint,
  live_reload: [
    patterns: [
      ~r"priv/static/(?!uploads/).*",
      ~r"priv/static/.*",
      ~r"priv/static/.*/.*",
      ~r"priv/static/.*/.*/.*",
      ~r"priv/static/.*/.*/.*/.*",
      ~r"priv/static/.*/.*/.*/.*/.*", #< idfk it works why am i up, you go past this you deserve it
      ~r"priv/gettext/.*(po)$",
      ~r"lib/app_web/controllers/.*_html.(ex|exs)$",
      ~r"lib/app_web/components/.*.(ex|exs)$",
      ~r"lib/app_web/components/layouts/.*$",
    ]
  ]

# Enable dev routes for dashboard and mailbox
config :otterly, dev_routes: true

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Initialize plugs at runtime for faster development compilation
config :phoenix, :plug_init_mode, :runtime

# Include HEEx debug annotations as HTML comments in rendered markup
config :phoenix_live_view, :debug_heex_annotations, true
