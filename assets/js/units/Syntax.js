export default {
	unitName: "Syntax",
	onConnected: function(){
		let lang = this.el.ds.language
		let txt = this.el.innerText
		let out = otty.highlighter.highlight(txt, {language: lang})
		this.el.innerHTML = out.value
	}
}