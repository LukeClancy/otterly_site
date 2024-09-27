defmodule OtterlyWeb.Router do
  use OtterlyWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {OtterlyWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", OtterlyWeb do
    pipe_through :browser
    get "/docs/:v",  DocsController, :docs
    get "/docs",  DocsController, :docs
    get "/",      HomeController, :home
    get "/test",  TestController, :test
    post "/test", TestController, :postin
  end

  # Enable LiveDashboard in development
  if Application.compile_env(:otterly, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser
      live_dashboard "/dashboard", metrics: OtterlyWeb.Telemetry
    end
  end
end
