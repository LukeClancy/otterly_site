[
  import_deps: [:ecto, :phoenix],
  plugins: [Styler],
  styler: [
    minimum_supported_elixir_version: "1.20.3"
  ],
  inputs: ["*.{ex,exs}", "{config,lib,test}/**/*.{ex,exs}"]
]
