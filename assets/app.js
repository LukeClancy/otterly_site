//tailwind says it does this for us? https://tailwindcss.com/docs/guides/phoenix
// import "./css/app.scss"
import {Otty, AfterDive, UnitHandler, Generic, Debug} from 'otterly'
import Syntax from "./js/units/Syntax"
import MoreOtters from "./js/units/more_otters"

import high from 'highlight.js/lib/core'
import hjs from 'highlight.js/lib/languages/javascript'
import hxml from 'highlight.js/lib/languages/xml'
import helixir from 'highlight.js/lib/languages/elixir'

//add new server tasks in OttyCan

let csrf_selector = 'meta[name="csrf-token"]'
let csrf_send_as = 'X-CSRF-Token'
let is_dev = true

//set up otty as a global variable named otty, along with various settings.
//AfterDive is set as the response handling object for the otty.dive method.
window.otty = new Otty(is_dev, AfterDive, csrf_selector, csrf_send_as)

//set up units, events, and a mutation observer to keep them synced with the
//html. This also sets up shortcuts in the 

high.registerLanguage('javascript', hjs)
high.registerLanguage('html', hxml)
high.registerLanguage('elixir', helixir)
high.registerLanguage('json', helixir)

otty.highlighter = high

otty.unitHandler = new UnitHandler([Generic, Debug, Syntax, MoreOtters])

otty.handleNavigation()