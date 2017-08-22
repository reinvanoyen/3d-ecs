let reader = new FileReader();

let input = document.createElement( 'input' );
input.setAttribute( 'type', 'file' );
document.body.appendChild( input );

input.addEventListener( 'change', e => {

	let file = input.files[ 0 ],
		type = /image.*/
		;

	if( file.type.match( type ) ) {

		reader.onload = ( e ) => {

			let img = new Image();
			img.src = reader.result;

			document.body.appendChild( img );
		};

		reader.readAsDataURL( file );
	}

} );