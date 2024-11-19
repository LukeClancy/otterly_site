
export default {
	unitName: "Expand",
	tailwindWidths: {
		sm: '640px',
		md: '768px',
		lg: '1024px',
		xl: '1280px',
		"2xl": '1536px'
	},
	unitConnected(e) {
		this.menu = this.el.qs("#menu_contents")
		this.content = this.el.qs('#content_area')
		this.button = this.el.qs('#expand_button')
		
		if(! this.el.ds.x){
			this.el.ds.default_self_c = this.button.getAttribute('class')
			this.el.ds.default_menu_c = this.menu.getAttribute('class')
			this.el.ds.default_content_c = this.content.getAttribute('class')
			if(window.innerWidth > parseInt(this.tailwindWidths.sm)) {
				this.el.ds.x = 1
			} else {
				this.el.ds.x = 0
			}
			this.toggle()
		}
	},
	yeetNextTwoInside(e){
		if(! e.ct.ds.yeeted){
			e.ct.insertAdjacentElement('beforeend', e.ct.nextElementSibling)
			e.ct.insertAdjacentElement('beforeend', e.ct.nextElementSibling)
		}
		e.ct.ds.yeeted = 'y'
	},
	content_disp(show){
		tog = (o) => {
			if(show){
				o.classList.remove('hidden')
				o.classList.remove('sm:visible')
				o.classList.remove('sm:block')
			} else {
				o.classList.add('hidden')
				o.classList.add('sm:visible')
				o.classList.add('sm:block')
			}
		}
		for(let o of this.content.children){
			if(o.classList.contains('inline-flex')){
				tog(o.children[1])
			}else{
				tog(o)
			}
		}
	},
	toggle(e){
		if(parseInt(this.el.ds.x % 2)  == 0) { //menu closed
			this.button.setAttribute('class',  `${this.el.ds.default_self_c} rotate-0` )
			this.menu.setAttribute('class', `${this.el.ds.default_menu_c} hidden`)
			this.content.setAttribute('class', `${this.el.ds.default_content_c} col-span-4`)
			this.content_disp(true)
		} else {//menu open
			this.button.setAttribute('class',  `${this.el.ds.default_self_c} rotate-180` )
			this.menu.setAttribute('class', `${this.el.ds.default_menu_c} col-span-3 sm:col-span-1`)
			this.content.setAttribute('class', `${this.el.ds.default_content_c} col-span-1 sm:col-span-3`)
			this.content_disp(false)
		}
		this.el.ds.x = parseInt(this.el.ds.x) + 1
	}
}