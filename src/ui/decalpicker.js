"use strict";

const $ = require('jquery');

class DecalPicker {

	constructor( pick ) {
		this.pick = pick;
		this.decalSrcs = [];
	}

	addDecal( src ) {

		this.decalSrcs.push( src );
	}

	buildDecal( src ) {

		let $container = $( '<div>' )
			.click( e => this.loadImage( src, img => this.pick( img ) ) )
		;

		let $img = $( '<img>' )
			.attr( 'src', src )
			.appendTo( $container )
		;

		return $container;
	}

	loadImage( src, cb ) {

		let img = new Image();
		img.onload = () => {
			cb( img );
		};
		img.src = src;
	}

	build() {

		this.$container = $( '<div>' )
			.addClass( 'decal-picker' )
		;

		this.$decalContainer = $( '<div>' )
			.addClass( 'decal-picker-container' )
			.appendTo( this.$container )
		;

		// Build input for custom decals from computer of user

		let $input = $( '<input>' )
			.attr( 'type', 'file' )
			.prependTo( this.$container )
		;

		let reader = new FileReader(),
			input = $input[ 0 ]
		;

		input.addEventListener( 'change', e => {

			let file = input.files[ 0 ],
				type = /image.*/
			;

			if( file.type.match( type ) ) {

				reader.onload = e => {

					this.$decalContainer.prepend( this.buildDecal( reader.result ) );
				};

				reader.readAsDataURL( file );
			}
		} );

		// Build default decals

		this.decalSrcs.forEach( src => {

			this.$decalContainer.append( this.buildDecal( src ) );
		} );

		return this.$container;
	}
}

module.exports = DecalPicker;