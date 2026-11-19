import Config

# config/runtime.exs is executed for all environments, including
# during releases. It is executed after compilation and before the
# system starts, so it is typically used to load production configuration
# and secrets from environment variables or elsewhere. Do not define
# any compile-time configuration in here, as it won't be applied.
# The block below contains prod specific runtime configuration.

# ## Using releases
#
# If you use `mix release`, you need to explicitly enable the server
# by passing the PHX_SERVER=true when you start it:
#
#     PHX_SERVER=true bin/app start
#
# Alternatively, you can use `mix phx.gen.release` to generate a `bin/server`
# script that automatically sets the env var above.


project_env = %{dev: "development", test: "test", prod: "production"}[config_env()]
# Load the creds compose_config decrypted for this env.
env_path = Path.expand("../vm/env/#{project_env}", __DIR__)

for line <- env_path |> File.read!() |> String.split("\n", trim: true) do
  [k, v] = String.split(line, "=", parts: 2)
  System.put_env(k, String.trim(v, "\""))
end

config :otterly, OtterlyWeb.Endpoint,
  server: (if System.get_env("PHX_SERVER"), do: true, else: false),
  secret_key_base: System.get_env("SECRET_KEY_BASE")
