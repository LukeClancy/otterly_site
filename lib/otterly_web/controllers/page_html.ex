defmodule OtterlyWeb.PageHTML do
  use OtterlyWeb, :html

  def get_text(x) when is_bitstring(x) do
    x
  end

  def get_text(x) do
    case x do
      {_, _, [y | _]} -> get_text(y)
      [y | _] -> get_text(y)
    end
  end

  def get_docs_info(assigns) do
    vers = Path.wildcard('assets/otterly/docs/*')
    version = assigns.conn.path_params["v"]
    IO.inspect assigns
    IO.inspect(version)

    #get version string, get version string as integer list, get path to the md file, and if selected.
    #Then sort by version, and default to highest version.
    vers = Enum.map(vers, fn v ->
      vstr = v |> split("/") |> at(-1)

      #get numbers split by dots ass an array of ints.
      vis = vstr |> split(".") |> Enum.map(fn i_str ->
          try do
            to_integer(i_str)
          rescue
            ArgumentError -> nil
          end
        end) |> Enum.filter(fn x -> x != nil end)

      #make sure any that are not versions just get shunted to the end.
      #also - we can select on if the version integers = [-1] for if its
      #not a version.

      vis = case (any?(vis)) do
        true -> vis
        false -> [-1]
      end

      vstr = vstr |> split(".md") |> at(0)

      %{
        v: vstr,
        vis: vis,
        path: v,
        selected: vstr == version
      }
    end)

    #sort the versions by integer list
    vers = sort_by(vers, &(&1.vis), :desc)

    #get the selected one, if no selected one, set the first one as selected
    {version, vers} = case find(vers, nil, &(&1.selected)) do
      nil ->
        first_v = vers |> at(0) |> put(:selected, true)
        upd_vers = vers |> List.replace_at(0, first_v)
        {first_v, upd_vers}
      v_selected -> {v_selected, vers}
    end

    #need the html, need the menu information. Menu information will be css selected out of the html.
    #first get the html, make sure we can switch versions (at least kind-of) and then we will figure out
    #backend selecting the headers and such. As we are currently doing this for a smaller doc, we can just get
    #it all on one page. For more pages, we can select on whether its a folder or a file, but that will be someone
    #elses deal, probably a future luke thing.
    {:ok, contents} = File.read(version.path)
    html = Earmark.as_html!(contents, %Earmark.Options{smartypants: true})

    {:ok, flok} = Floki.parse_fragment(html)

    #id-erize headers.
    flok = Floki.traverse_and_update(flok, fn h ->
      {name, attr, children} = h
      case name in ~W'h1 h2 h3 h4 h5 h6 h7' do
        true ->
          txt = get_text(children)
          new_id = txt |> downcase(:default) |> trim |> String.replace(" ", "_")
          {name, [{"id", new_id} | attr], children}
        _ -> h
      end
    end)

    flok = Floki.traverse_and_update(flok, fn h ->
      case h do
        {"ul", attr, child} -> {"ul", [{"class", "list-discer"} | attr], child}
        x -> x
      end
    end)

    flok = Floki.traverse_and_update(flok, fn h ->
      case h do
        {"code", [{"class", x} | attrs], child} ->
            {"code", [{"class", x}, {"data-language", x}, {'data-unit', 'Syntax'} | attrs], child}
        _ -> h
      end
    end)

    headers = flok |> Floki.find("h1, h2, h3, h4, h5, h6, h7, h8")

    raw = Floki.raw_html(flok)

    %{versions: vers, html: raw, menu: headers, version: version}
  end

  def menu(assigns) do
    temple do
      ul do
        for m <- @assigns.docs_info.menu do
          {name, attrs, child} = m
          claz = case name do
            "h1" -> "ms-0"
            "h2" -> "ms-2"
            "h3" -> "ms-4"
            "h4" -> "ms-6"
            "h5" -> "ms-8"
            "h6" -> "ms-10"
          end
          [{"id", headerId} | _] = attrs
          li(class: claz) do
            a(href: "##{headerId}") do
              get_text(child)
            end
          end
        end
      end
    end
  end

  def whitespace_responsive_code(codetype, code) do
    {:ok, b, c} = Earmark.as_html("```#{codetype}
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
                  p class: "italic flex-shrink ms-auto me-9", do: "go to docs"
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
          div(data_language: :javascript, data_unit: "Syntax") do
            "let x = 0"
          end
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
          div(class: "btn ms-auto flex-shrink w-40", data_on: "click->makeOtter") do
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

          button(href: "/docs", class: "btn ms-auto justify-end w-40 float-right") do
            "go to docs"
          end
        end
      end
    end
  end

  def docs(assigns) do
    assigns = Map.put(assigns, :docs_info, get_docs_info(assigns))

    temple do
      div(class: "max-w-screen-xl mx-auto px-3 grid grid-cols-4 gap-4", data_unit: "Expand") do
        div(class: "col-span-4") do
          flash_group(assigns)
        end
        div(id: "menu_contents", class: "bg-slate-300 rounded sticky top-5 max_h90vh")do #, data_unit: "Menu"
          div(class: "p-2") do
            span(class: "flex flex-wrap") do
              for v <- @docs_info.versions do
                  c_def = "pr-2"
                  classy = if(v.selected, do: c_def <> " underline", else: c_def)
                a(href: ~p"/docs/#{v.v}", class: classy) do
                  h3 do: v.v
                end
              end
            end
            c &menu/1, assigns: assigns
          end
        end
        div(class: "rounded p-2 md ", id: "content_area")do
          div(class: "inline-flex", data_on: "_parse->yeetNextTwoInside")
          span(id: "expand_button", class: "mt-2 sm:mt-8 inline-block hero-play-solid sticky bg-slate-300 h-10 w-10 margin", data_on: 'click->toggle')
           raw @docs_info.html
        end
      end
    end
  end
  def test(assigns) do
    temple do
      div(data_unit: "Debug", data_x: 'click->log') do
        p do: "Oh hai how are you"
      end
    end
  end
end
