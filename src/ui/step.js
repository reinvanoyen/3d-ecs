"use strict";

const $ = require( 'jquery' );

class Step {

	constructor( title, iconSrc, build, destroy ) {

		this.stepInterface = null;
		this.index = null;

		this.title = title;
		this.iconSrc = iconSrc;

		this.build = build;
		this.destroy = destroy;
	}

	setStepInterface( stepInterface ) {
		this.stepInterface = stepInterface;
	}

	setIndex( index ) {
		this.index = index;
	}

	buildButton() {

		this.$button = $( '<button>' )
			.text( this.title )
			.click( e => this.stepInterface.setActiveStep( this.index ) )
		;

		return this.$button;
	}

	setActive() {
		this.$button.addClass( 'active' );
	}

	setInactive() {
		this.$button.removeClass( 'active' );
	}
}

module.exports = Step;