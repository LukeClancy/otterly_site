import Config

# Print only warnings and errors during test
config :logger, level: :warning

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :otterly, OtterlyWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: System.get_env("SECRET_KEY_BASE"),
  server: false

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
