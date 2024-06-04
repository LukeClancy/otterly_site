defmodule Otterly.MixProject do
  use Mix.Project

  def project do
    [
      app: :otterly,
      version: "0.1.1",
      elixir: "~> 1.14",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      compilers: [:temple] ++ Mix.compilers(),
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Otterly, []},
      included_applications: [:ua_inspector],
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:earmark, "~> 1.4.46"},
      {:ua_inspector, "~> 3.0"},
      {:ecto, "~> 3.11.2"},
      {:temple_phoenix, "~> 0.1"},
      {:temple, "~> 0.12"},
      {:surrealix, "~> 0.1.8"},
      {:bun, "~> 1.1", runtime: Mix.env() == :dev},
      {:phoenix, "~> 1.7.11"},
      {:phoenix_html, "~> 3.2"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:phoenix_live_view, "~> 0.20.2"},
      {:floki, ">= 0.30.0"}, #, only: :test
      {:phoenix_live_dashboard, "~> 0.8.3"},
      {:tailwind, "~> 0.2", runtime: Mix.env() == :dev},
      {:heroicons,
       github: "tailwindlabs/heroicons",
       tag: "v2.1.1",
       sparse: "optimized",
       app: false,
       compile: false,
       depth: 1},
      {:telemetry_metrics, "~> 0.6"},
      {:telemetry_poller, "~> 1.0"},
      {:gettext, "~> 0.20"},
      {:jason, "~> 1.2"},
      {:dns_cluster, "~> 0.1.1"},
      {:bandit, "~> 1.2"}
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to install project dependencies and perform other setup tasks, run:
  #
  #     $ mix setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      setup: ["deps.get", "assets.setup", "assets.deploy", "ua_inspector.download"],
      "assets.setup": ["tailwind.install --if-missing"],
      "assets.build": [
        "tailwind app",
        "bun ./bundling.js"
      ],
      "assets.deploy": [
        "tailwind app --minify",
        "bun ./bundling.js --minify",
        "phx.digest",
        # "bun ./bundling.js --relink"
      ]
    ]
  end
end
