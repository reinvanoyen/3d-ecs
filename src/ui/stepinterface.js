"use strict";

const $ = require( 'jquery' );

class StepInterface {

	constructor() {
		this.steps = [];
		this.currentStepIndex = -1;
	}

	addStep( step ) {

		step.setStepInterface( this );
		step.setIndex( this.steps.length );
		this.steps.push( step );
	}

	build() {

		let $container = $( '<div>' )
			.addClass( 'step-interface' )
		;

		let $nav = $( '<nav>' )
			.addClass( 'step-interface-nav' )
			.appendTo( $container )
		;

		let $side = $( '<div>' )
			.addClass( 'step-interface-side' )
			.appendTo( $container )
		;

		this.$sideTitle = $( '<div>' )
			.addClass( 'step-interface-side-title' )
			.appendTo( $side )
		;

		this.$sideContent = $( '<div>' )
			.addClass( 'step-interface-side-content' )
			.appendTo( $side )
		;

		let $nextNav = $( '<div>' )
			.addClass( 'step-interface-side-next' )
			.appendTo( $side )
		;

		let $nextButton = $( '<button>' )
			.text( 'Next' )
			.click( e => this.setNextStep() )
			.appendTo( $nextNav )
		;

		this.$content = $( '<div>' )
			.addClass( 'step-interface-content' )
			.appendTo( $container )
		;

		this.steps.forEach( s => {
			$nav.append( s.buildButton() );
		} );

		this.setActiveStep( 0 );

		return $container;
	}

	setActiveStep( index ) {

		if( this.currentStepIndex != index ) {

			this.currentStepIndex = index;

			this.steps.forEach( s => {
				if( s.index != index ) {
					s.destroy();
					s.setInactive();
				}
			} );

			let step = this.getStepByIndex( index );

			this.$sideTitle.text( step.title );
			this.$sideContent.empty().append( step.build() );

			step.setActive();
		}
	}

	getStepByIndex( index ) {
		return this.steps[ index ];
	}

	setNextStep() {
		this.setActiveStep( this.currentStepIndex + 1 );
	}
}

module.exports = StepInterface;