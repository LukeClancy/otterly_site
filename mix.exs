defmodule Otterly.MixProject do
  use Mix.Project

  def project do
    [
      app: :otterly,
      version: "0.1.1",
      elixir: "~> 1.20",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      compilers: [:temple] ++ Mix.compilers(),
      listeners: [Phoenix.CodeReloader]
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {Otterly, []},
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
      {:ecto, "~> 3.0"},
      {:temple_phoenix, "~> 0.1"},
      {:temple, "~> 0.14"},
      {:esbuild, "~> 0.10", runtime: Mix.env() == :dev},
      {:phoenix, "~> 1.8"},
      {:phoenix_html, "~> 4.3"},
      {:phoenix_live_reload, "~> 1.0", only: :dev},
      {:phoenix_live_view, "~> 1.0"},
      # , only: :test
      {:floki, "~> 0.0"},
      {:phoenix_live_dashboard, "~> 0.9"},
      {:tailwind, "~> 0.0", runtime: Mix.env() == :dev},
      {:heroicons,
       github: "tailwindlabs/heroicons", tag: "v2.1.1", sparse: "optimized", app: false, compile: false, depth: 1},
      {:telemetry_metrics, "~> 0.0"},
      {:telemetry_poller, "~> 1.0"},
      {:gettext, "~> 1.0"},
      {:jason, "~> 1.0"},
      {:dns_cluster, "~> 0.2"},
      {:bandit, "~> 1.0"},
      {:mdex, "~> 0.13"},
      {:styler, "~> 1.12", runtime: Mix.env() == :dev}
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
      setup: ["deps.get", "assets.setup", "assets.deploy"],
      "assets.setup": ["tailwind.install --if-missing", "esbuild.install --if-missing", &npm_install/1],
      "assets.build": [
        "tailwind otterly",
        "esbuild otterly"
      ],
      "assets.deploy": [
        "tailwind otterly --minify",
        "esbuild otterly --minify",
        "phx.digest"
      ]
    ]
  end

  # esbuild only bundles what's already on disk - highlight.js, morphdom, and
  # @ungap/custom-elements are real npm packages, so they still need a plain
  # `npm install` in assets/ to populate assets/node_modules.
  defp npm_install(_args) do
    {_, 0} = System.cmd("npm", ["install"], cd: "assets", into: IO.stream())
  end
end
