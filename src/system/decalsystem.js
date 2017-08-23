"use strict";

const ECS = require('yagl-ecs'),
	THREE = require('three')
;

require('../utils/decalgeometry');

class DecalSystem extends ECS.System {

	constructor( scene ) {

		super();
		this.scene = scene;

		this.decals = [];

		let input = document.createElement( 'input' );
		input.setAttribute( 'type', 'file' );
		document.body.appendChild( input );

		// @TODO
		let reader = new FileReader();

		input.addEventListener( 'change', e => {

			let file = input.files[ 0 ],
				type = /image.*/
			;

			if( file.type.match( type ) ) {

				reader.onload = ( e ) => {

					let img = new Image();
					this.setTextureFromImage( img );
					img.src = reader.result;
				};

				reader.readAsDataURL( file );
			}
		} );
	}

	setTextureFromImage( img ) {

		this.texture = new THREE.Texture( img );

		img.onload = () => {

			// @TODO make it sizable
			this.sizeVec3 = new THREE.Vector3( img.width / 500, img.height / 500, 1 );
			this.texture.needsUpdate = true;
		};

		this.decalMaterial = new THREE.MeshPhongMaterial( {
			specular: 0x444444,
			map: this.texture,
			shininess: 30,
			transparent: true,
			depthTest: true,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: - 4,
			wireframe: false
		} );
	}

	test( entity ) {

		return entity.components.decal && entity.components.clickable;
	}

	update( entity ) {

		let {clickable} = entity.components;

		if( clickable.clicked ) {

			if( this.decalMaterial ) {

				let material = this.decalMaterial.clone();
				// material.color.setHex( Math.random() * 0xffffff );

				let positionVec3 = new THREE.Vector3( clickable.x, clickable.y, clickable.z );

				let m = new THREE.Mesh( new THREE.DecalGeometry( entity.mesh, positionVec3, clickable.orientation, this.sizeVec3), material );

				this.scene.add(m);
				this.decals.push(m);
			}
		}
	}
}

module.exports = DecalSystem;