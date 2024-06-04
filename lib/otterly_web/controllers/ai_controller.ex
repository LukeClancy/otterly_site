defmodule OtterlyWeb.AiController do
  use OtterlyWeb, :controller

  def idex(conn, _params) do
    render(conn, :index)
  end
  def conv(conn, _params) do
    render conn, :conv
  end
end
