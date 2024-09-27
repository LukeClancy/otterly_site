defmodule OtterlyWeb.TestHTML do
  use OtterlyWeb, :html
  def test(assigns) do
    ~H"""
      <div {%{data_unit: "AAA"}}></div>
      <div {%{data_unit: "Test"}}>
        <p class="font-medium"> runs data-on: <span data-unit="Test" data-on={"_parse->log[\"hi\"]"}>false</span> </p>
      </div>
    """
  end
end
