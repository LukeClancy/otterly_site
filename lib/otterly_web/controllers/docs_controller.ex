defmodule OtterlyWeb.DocsController do
  use OtterlyWeb, :controller
  def docs(conn, _params) do
    render conn, :docs
  end

  def test(conn, _params) do
    render conn, :test
  end
end
