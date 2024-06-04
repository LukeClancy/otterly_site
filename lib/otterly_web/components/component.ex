defmodule OtterlyWeb.Component do
  # use OtterlyWeb.Components
  import Temple

  def page_base(assigns) do
    temple do
      div(class:  "px-4 sm:px-6 lg:px-8") do
        div(class: "flex px justify-between py-3 max-w-screen-lg mx-auto") do
          @inner_block
        end
      end
    end
  end
end
