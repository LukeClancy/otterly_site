# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config
require Logger

parse_env_vars = fn (filename) ->
  Logger.warning("FILENAME #{filename}")
  {:ok, txt} = File.read(filename)
  Logger.warning("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
  System.put_env(
    String.splitter(txt, "\n", trim: true) |>
    #remove comments and whitespace
    Enum.map(&String.trim/1) |>
    Enum.filter(fn z -> !(String.at(z,0) == "#" && String.contains?('=')) end) |>
    #get the key and the value
    Enum.map(fn z ->
      #do nothing on failing bad format
      try do
        [k,v] = String.split(z, "=", parts: 2)
        #trimmmmm
        k = String.trim k
        v = String.trim v
        #remove any quotes
        v = case (String.at(v, 0) == "'" and String.at(v,-1) == "'") or (String.at(v, 0) == "\"" and String.at(v,-1) == "\"") do
          true -> String.slice(v, 1..-2)
          false -> v
        end
        {k,v}
      rescue RuntimeError -> false
        Logger.warning("ENV file line failed: #{z}")
      end
    end) |>
    Enum.filter(fn z -> z != false end)
  )
end

env_files = %{
  test:   "../bin/private/development.sh",
  dev:   "../bin/private/development.sh",
  shared: "../bin/private/shared.sh",
  prod:  "/home/luke/production.sh",
  shared_prod:  "/home/luke/shared.sh",
}
case config_env() do
  :prod ->
    Logger.warning("SETTING UP PRODUCTION")
    parse_env_vars.(Map.fetch!(env_files, :prod))
    parse_env_vars.(Map.fetch!(env_files, :shared_prod))
    _ ->
    Logger.warning("SETTING UP DEVELOPMENT")
    parse_env_vars.(Map.fetch!(env_files, :dev))
    parse_env_vars.(Map.fetch!(env_files, :shared))
end

config :bun,
  version: "1.1.12",
  otterly: [
    args: ~w(_build/bun bundling.js),
    # cd: Path.expand("..", __DIR__),
    env: %{"ENVIROMENT_IS" => Atom.to_string(config_env())}
  ]

config :otterly, generators: [timestamp_type: :utc_datetime]

# Configures the endpoint
config :otterly, OtterlyWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [
    formats: [html: OtterlyWeb.ErrorHTML, json: OtterlyWeb.ErrorJSON],
    layout: false
  ],
  pubsub_server: Otterly.PubSub
  #live_view: [signing_salt: "qLluRZM4"]

# Configure tailwind (the version is required)
config :tailwind,
  version: "3.4.0",
  otterly: [
    args: ~w(
      --config=tailwind.config.js
      --input=css/app.scss
      --output=../priv/static/app.css
    ),
    cd: Path.expand("../assets", __DIR__)
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :temple,
  aliases: [
    label: :label_tag,
    link: :link_tag,
    select: :select_tag,
    textarea: :textarea_tag
  ]

## in config.exs / runtime.exs file
config :surrealix, backoff_max: 2000
config :surrealix, backoff_step: 50
config :surrealix, timeout: :infinity # default 5000
config :surrealix, :conn,
  hostname: "0.0.0.0",
  port: 8000

remote_database = "https://raw.githubusercontent.com/matomo-org/device-detector/6.3.0/regexes"
remote_shortcode = "https://raw.githubusercontent.com/matomo-org/device-detector/6.3.0"

config :phoenix, :template_engines, exs: Temple.Engine

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# config :ua_inspector,
#   database_path: Application.app_dir(:otterly, ["priv", "uadbs"]),
#   http_opts: [],
#   remote_path: [
#     bot: remote_database,
#     browser_engine: remote_database <> "/client",
#     client: remote_database <> "/client",
#     client_hints: remote_database <> "/client/hints",
#     device: remote_database <> "/device",
#     os: remote_database,
#     short_code_map: remote_shortcode,
#     vendor_fragment: remote_database
#   ],
#   remote_release: "6.3.0",
#   startup_silent: false,
#   startup_sync: true,
#   yaml_file_reader: {:yamerl_constr, :file, [[:str_node_as_binary]]}

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
