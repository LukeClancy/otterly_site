defmodule OtterlyWeb do
  @moduledoc """
  The entrypoint for defining your web interface, such
  as controllers, components, channels, and so on.

  This can be used in your application as:

      use OtterlyWeb, :controller
      use OtterlyWeb, :html

  The definitions below will be executed for every controller,
  component, etc, so keep them short and clean, focused
  on imports, uses and aliases.

  Do NOT define functions inside the quoted expressions
  below. Instead, define additional modules and import
  those modules here.
  """

  def static_paths, do: ~w(assets fonts images favicon.ico robots.txt app.css)

  def router do
    quote do
      use Phoenix.Router, helpers: false

      # Import common connection and controller functions to use in pipelines
      import Plug.Conn
      import Phoenix.Controller
      import Phoenix.LiveView.Router
      unquote default_shorts()
    end
  end

  @spec channel() ::
          {:use, [{:column, 7} | {:context, OtterlyWeb} | {:imports, [...]}, ...],
           [{:__aliases__, [...], [...]}, ...]}
  def channel do
    quote do
      use Phoenix.Channel
      unquote default_shorts()
    end
  end

  def controller do
    quote do
      use Phoenix.Controller,
        formats: [:html, :json],
        layouts: [html: OtterlyWeb.Layouts]

      import Plug.Conn
      import OtterlyWeb.Gettext

      unquote(verified_routes())
      unquote default_shorts()
    end
  end

  def live_view do
    quote do
      use Phoenix.LiveView,
        layout: {OtterlyWeb.Layouts, :otterly}

      unquote(html_helpers())
      unquote default_shorts()
    end
  end

  def live_component do
    quote do
      use Phoenix.LiveComponent

      unquote(html_helpers())
      unquote default_shorts()
    end
  end


  def component do
    quote do
      import Temple
      use Temple.Component
      unquote default_shorts()
    end
  end

  def html do
    quote do
      use Phoenix.Component
      import Temple
      use Temple.Component

      # import Temple
      # alias Temple

      # Import convenience functions from controllers
      import Phoenix.Controller, only: [get_csrf_token: 0, view_module: 1, view_template: 1]

      # Include general helpers for rendering HTML
      unquote(html_helpers())
      unquote default_shorts()
    end
  end

  defp html_helpers do
    quote do
      # HTML escaping functionality
      import Phoenix.HTML
      # Core UI components and translation
      import OtterlyWeb.CoreComponents
      import OtterlyWeb.Gettext

      # Shortcut for generating JS commands
      # alias Phoenix.LiveView.JS

      # Routes generation with the ~p sigil
      unquote(verified_routes())
      unquote default_shorts()
    end
  end

  def verified_routes do
    quote do
      use Phoenix.VerifiedRoutes,
        endpoint: OtterlyWeb.Endpoint,
        router: OtterlyWeb.Router,
        statics: OtterlyWeb.static_paths()
      unquote default_shorts()
    end
  end

  def view do
    quote location: :keep do
      import Temple.Component
      unquote default_shorts()
    end
  end

  def default_shorts do
    quote do
      #Just easier this way I think. If its used regularly just short it.
      import Enum, only: [at: 2, any?: 1, sort_by: 3, find: 3]
      import Map, only: [put: 3]
      import String, only: [split: 2, to_integer: 1, downcase: 2, trim: 1, replace: 3]
    end
  end

  @doc """
  When used, dispatch to the appropriate controller/view/etc.
  """
  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end

  defmacro __using__() do
    apply(__MODULE__, :default_shorts, [])
  end
end
