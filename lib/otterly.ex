defmodule Otterly do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      OtterlyWeb.Telemetry,
      {DNSCluster, query: Application.get_env(:otterly, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Otterly.PubSub},

      # Start a worker by calling: App.Worker.start_link(arg)
      # {App.Worker, arg},
      # Start to serve requests, typically the last entry
      OtterlyWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Otterly.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    OtterlyWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
