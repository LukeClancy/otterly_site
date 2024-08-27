//tailwind says it does this for us? https://tailwindcss.com/docs/guides/phoenix
// import "./css/app.scss"
import {Otty, AfterDive, UnitHandler, Generic, Debug} from 'otterly'
import Syntax from "./js/units/syntax"
import MoreOtters from "./js/units/more_otters"
import Expand from './js/units/expand'

import high from 'highlight.js/lib/core'
import hjs from 'highlight.js/lib/languages/javascript'
import hxml from 'highlight.js/lib/languages/xml'
import helixir from 'highlight.js/lib/languages/elixir'
import bash from 'highlight.js/lib/languages/bash.js'

let startApp = () => {
	//add new server tasks in OttyCan
	let csrfSelector = 'meta[name="csrf-token"]'
	let csrfSendAs = 'X-CSRF-Token'
	let isDev = true

	//set up otty as a global variable named otty, along with various settings.
	//AfterDive is set as the response handling object for the otty.dive method.
	window.otty = new Otty(isDev, AfterDive, csrfSelector, csrfSendAs)

	high.registerLanguage('javascript', hjs)
	high.registerLanguage('html', hxml)
	high.registerLanguage('elixir', helixir)
	high.registerLanguage('json', helixir)
	high.registerLanguage('bash',  bash)


	//set up units, events, and a mutation observer to keep them synced with the
	//html. This also sets up shortcuts in the
	otty.highlighter = high

	otty.unitHandler = new UnitHandler(Generic, [Generic, Debug, Syntax, MoreOtters, Expand])

	otty.handleNavigation({navigationReplaces: ['#replace-area' , 'body']})
}

//protect from double loading updates causing weird errors. Increment version if particullarly egrigous.
let version = 1
if(window.otterlySite && window.otterlySite.version != version){
	window.location.reload()
} else if(!(window.otterlySite)) {
	window.otterlySite = {version: version}
	startApp()
}