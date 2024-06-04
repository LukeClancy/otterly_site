defmodule OtterlyWeb.Layouts do
  use OtterlyWeb, :html

  def root(assigns) do
    temple do
      "<!DOCTYPE html>"
      html do
        head do
          meta charset: "utf-8"
          meta name: "viewport", content: "width=device-width, initial-scale=1"
          meta itemprop: :image, src: ~p"/assets/files/logo2.png", alt: 'otterlyjs'
          meta name: "csrf-token", content: get_csrf_token()
          title do
            # assigns[:page_title] || " · otterlyjs"
            "otterlyjs"
          end
          #not sure why it wouldn't work with temple, it was in the docs... well whatev
          raw("<link rel=\"stylesheet\" href=\"#{~p"/app.css"}\">
<link rel=\"icon\" type=\"image/x-icon\" href=\"/favicon.ico\">
")
# <link href=\"/assets/css/theme.css\" rel=\"stylesheet\" type=\"text/css\">
# <script src=\"/assets/js/rainbow.js\"></script>
# <script src=\"/assets/js/language/generic.js\"></script>
# <script src=\"/assets/js/language/javascript.js\"></script>
# <script src=\"/assets/js/language/html.js\"></script>
          script defer: "true", phx_track_static: true, src: ~p"/assets/app.js"
        end
        body(class: "bg-white antialiased") do
          @inner_content
        end
      end
    end
  end

  def app(assigns) do
    temple do
      header(class:  "px-4 sm:px-6 lg:px-8") do
        div(class: "flex px justify-between border-b border-zinc-200 py-3  mx-auto") do
          a(href: "/") do
            img(src: ~p"/assets/files/logo.png", width: "64", class: "otter-wiggle")
          end
          a(href: "/", class: "sm:flex grow self-center sm:gap-4 text-brand hover:text-orange-400") do
              p(class: "rounded-full ps-4 font-medium text-xl sm:text-3xl") do
                "otterly js"
              end
              p(class: "ps-4 md:ps-8 lg:ps-12 self-center text-medium md:text-large") do
                "small · fast · fierce"
              end
          end
          span(class: "flex items-center font-semibold leading-6 text-zinc-900") do
            a(href: "https://github.com/LukeClancy/otterly", class: "hover:text-zinc-700 ms-4") do
              img(src: ~p"/assets/files/github-logo.png", width: '30')
            end
            a(href: "https://www.linkedin.com/in/luke-t-clancy", class: "hover:text-zinc-700 ms-4") do
              img(src: ~p"/assets/files/linkedin.png", width: '30')
            end
            a(href: "https://www.phoenixframework.org/") do
              img(src: ~p"/assets/files/phoenix-logo.png", width: "40", class: "ms-4")
            end

            a(href: "https://www.phoenixframework.org/") do
              p class: "hidden sm:block font-light place-self-end py-4 ms-1",  do: "v#{to_string(Application.spec(:phoenix, :vsn))}"
              p class: "block sm:hidden font-light place-self-end py-4 ms-1",  do: "v#{to_string(Application.spec(:phoenix, :vsn)) |> String.split(".") |> Enum.take(2) |> Enum.join(".")}"
            end
          end
        end
      end

        @inner_content
    end
  end
end
