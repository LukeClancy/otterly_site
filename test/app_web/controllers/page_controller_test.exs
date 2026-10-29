defmodule OtterlyWeb.PageControllerTest do
  use OtterlyWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, ~p"/")
    assert html_response(conn, 200) =~ "Its otterly"
  end
end
