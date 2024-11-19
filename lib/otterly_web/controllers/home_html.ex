defmodule OtterlyWeb.HomeHTML do
  use OtterlyWeb, :html

  def whitespace_responsive_code(codetype, code) do
    {:ok, b, _} = Earmark.as_html("```#{codetype}
#{code}
```", %Earmark.Options{smartypants: true})
    temple do
      raw( replace(b, "<code", "<code data-language=\"#{codetype}\" data-unit=\"Syntax\"") )
    end
  end

  def home(assigns) do
    temple do
      div(class: "max-w-screen-md sm:max-w-screen-lg mx-auto px-3 grid grid-cols-4 gap-7") do
        div(class: "col-span-4") do
          flash_group(assigns)
        end
        div(class: "col-span-4  p-2")do
          span(class: "flex justify-center") do
            a href: "/docs", class: "flex grow self-center justify-center" do
              div(class: "self-center") do
                div(class: "rounded text-brand rounded-full px-2 font-medium text-4xl lg:text-7xl") do
                  p do: "Its otterly🦦 the best"
                end
                div(class: "flex") do
                  p class: "italic flex-shrink ml-auto me-9", do: "go to docs"
                end
              end
            end
          end
        end
        div(class: "col-span-4") do
          "Accessible and intuitive DOM code - localized to where it matters. Write effective Javascript - take a look!"
        end
        div(class: "col-span-4 sm:col-span-2 bg-slate-300 rounded") do
          whitespace_responsive_code('javascript', "export default {
  unitName: \"MoreOtters\",
  otterCount: 0,
  makeOtter: function(){
    this.el.insertAdjacentText('afterbegin', \"🦦\")
    this.otterCount += 1
  }
  }")
        end
        div(class: "col-span-4 sm:col-span-2 rounded") do
          whitespace_responsive_code('html', '<div data-unit="MoreOtters">
  <div class=\"btn\" data-on=\"click->makeOtter\">
    Make an Otter!
  </div>
  </div>')
        end
        br
        br
        div(class: "col-span-4 flex", data_unit: "MoreOtters") do
          div(class: "btn ml-auto flex-shrink w-40", data_on: "click->makeOtter") do
            "Make an Otter!"
          end
        end
        br
        br
        div(class: "col-span-4") do
          whitespace_responsive_code('javascript', '//Then simply access the unit, and get or run what you need!
  let otterEl = document.querySelector(\'[data-unit="MoreOtters"]\')
  let unit = otterEl._unit
  let otters = unit.otterCount')
        end
        div(class: "col-span-4") do
          br
          br

          p class: "shrink", do: "Made to be simple but powerfull, we provide a small but strong basis for Single Page Applications, Progressive Web Apps and Ajax / Forms. Current status has Events, AJAX and SPA capabilites handled. PWA capabilites are being considered in the future, but not currently."

          br
          br
          br

          button(href: "/docs", class: "btn ml-auto justify-end w-40 float-right") do
            "go to docs"
          end
        end
      end
    end
  end
end
