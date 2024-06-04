defmodule OtterlyWeb.AiHTML do
  use OtterlyWeb, :html
  def index(_assigns) do
    temple do
      div(data_unit: "Debug", data_x: 'click->log') do
        p do: "Oh hai how are you"
      end
    end
  end
  def conv(_assigns) do

  end
end
