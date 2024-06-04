defmodule OtterlyWeb.PageController do
  use OtterlyWeb, :controller
  def home(conn, _params) do
    render conn, :home
  end
  def docs(conn, _params) do
    render conn, :docs
  end
  def test(conn, _params) do
    render conn, :test
  end
end
