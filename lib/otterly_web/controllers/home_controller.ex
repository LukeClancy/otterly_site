defmodule OtterlyWeb.HomeController do
  use OtterlyWeb, :controller
  def home(conn, _params) do
    render conn, :home
  end

  def test(conn, _params) do
    render conn, :test
  end
end
