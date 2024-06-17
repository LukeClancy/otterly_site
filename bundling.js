import Bun		from 'bun'
import { readdir }	from 'node:fs/promises'
import { watch }	from "fs/promises";
import { parseArgs }	from "util"

//good practice, sort of figured webpack out though and bun has its own weirdnesses as its so new.
//Keepin eye on it but have gone back to WP.

let { values, positionals } = parseArgs({
	options: {watch: {type: 'boolean'}, minify: {type: 'boolean'}, relink: {type: 'boolean'}}
})

let assetlink = './assets/assetlink.js'		//< autogenerated file that lists assets for build
let assetlink_watchname = 'assetlink.js'
// let assetlistloc = 'priv/static/assets/assetlist.json'	//< json file that lists assets for phoenix
let main_entry = "./assets/app.js"						//< primary asset entry location
let outdir = "priv/static/assets"						//< no dot, do not add the dot. For reasons
let manifest_loc = 'priv/static/cache_manifest.json'
let manifest_dir = 'priv/static'
let link_types = ['js', 'css']

async function f(drop_old_assets) {
	return new Promise(async function(resolve, reject){
		//1. keep it clean
		if(drop_old_assets){
			await Bun.$`rm -rf ${outdir}/*`
		}

		//2. list the assets in a javascript file so Bun.build can find em
		let ims = await readdir('./assets/files', {recursive: true})
		let x = 0
		let str = ''
		let nm, im, loc
		str += "//this file is auto-generated when assets change so that assets get bundled correctly. See bundling.js and bun related config."
		for(im of ims) {
			nm = "x" + x
			x += 1
			loc = "files/" + im
			str += "import " + nm + " from './"+ loc +"'\n"
		}
		str += "export default x1"

		await Bun.write(assetlink, str)

		//3.export to the outdir. Dont hash the names because phx.digest will do it for us *whispers* ithinkimprettysureatleast
		let res = await Bun.build({
			entrypoints: [main_entry, assetlink],
			outdir: outdir,
			minify: values['minify'],
			// sourcemap: 'inline', <- this shit breaks everything if you set it. Maybe they fix one day? Im on 1.0.26 and it dies on jpegs and screws with naming
			//see here: https://github.com/oven-sh/bun/issues?q=is%3Aissue+is%3Aopen+sourcemap+
			//and here: https://github.com/oven-sh/bun/issues/7427
			target: 'browser',
			naming: {
				entry: '[dir]/[name].[ext]', //-[hash]
				chunk: '[dir]/[name].[ext]', // -[hash]
				asset: '[dir]/[name].[ext]' //-[hash]
			}
		})
		if(!res['success']) {
			console.log("Rejected!", res)
			resolve('actually failed but please dont error out')
		} else {
			console.log("Success!")
			resolve(res['success'])
		}

	})
}

if(values['watch']){
	const watcher = watch( "./assets", { recursive: true } )
	for await (const event of watcher) {
		//make sure we dont get triggered by assetlink or we hit some recursive shennanigens
		if(!(event.eventType == 'change' && event.filename == assetlink_watchname)) {
			await f(false)
		}
	}
} else if(values['relink']) {
	// let f = Bun.file(manifest_loc)
	// let txt = await f.text()
	// let json = JSON.parse(txt)['latest']
	// let srch = {}
	// for(let [k, v] of Object.entries(json)){
	// 	srch[k.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')] = v
	// }
	// for([k, v] of Object.entries(json)){
	// 	//make sure its not an image or random data etc.
	// 	if(link_types.include(v.split('.').pop())){
	// 		let f = Bun.file(`${manifest_dir}/${v}`)
	// 		txt = await f.text()
	// 		await Bun.write()
	// 	}
	// }
} else {
	await f(false)
}

