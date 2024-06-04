export default {
	unitName: "MoreOtters",
	otterCount: 0,
	makeOtter: function(){
		this.el.insertAdjacentText('afterbegin', "🦦")
		this.otterCount += 1
	}
}