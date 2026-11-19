# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :esbuild,
  version: "0.28.2",
  otterly: [
    args: ~w(app.js --sourcemap --bundle --target=es2022 --outdir=../priv/static/assets),
    cd: Path.expand("../assets", __DIR__),
    env: %{"ENVIROMENT_IS" => Atom.to_string(config_env())}
  ]

# config :tailwind,
#  version: "3.4.0",
#  otterly: [
#    args: ~w(
#      --config=tailwind.config.js
#      --input=css/app.scss
#      --output=../priv/static/app.css
#    ),
#    cd: Path.expand("../assets", __DIR__)
#  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Configures the endpoint
config :otterly, OtterlyWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [html: OtterlyWeb.ErrorHTML, json: OtterlyWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: Otterly.PubSub

config :otterly, generators: [timestamp_type: :utc_datetime]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason
config :phoenix, :template_engines, exs: Temple.Engine

# # default 5000
# config :surrealix, :conn,
#   hostname: "0.0.0.0",
#   port: 8000

# ## in config.exs / runtime.exs file
# config :surrealix, backoff_max: 2000
# config :surrealix, backoff_step: 50
# config :surrealix, timeout: :infinity

# live_view: [signing_salt: "qLluRZM4"]

# Configure tailwind (the version is required)
config :tailwind,
  version: "3.2.7",
  otterly: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.scss
      --output=../priv/static/app.css
     ),

    # remote_database = "https://raw.githubusercontent.com/matomo-org/device-detector/6.3.0/regexes"
    # remote_shortcode = "https://raw.githubusercontent.com/matomo-org/device-detector/6.3.0"

    cd: Path.expand("../assets", __DIR__)
  ]

config :temple,
  aliases: [
    label: :label_tag,
    link: :link_tag,
    select: :select_tag,
    textarea: :textarea_tag
  ]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
