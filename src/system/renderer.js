"use strict";

const ECS = require('yagl-ecs'),
	THREE = require('three')
;

require('../utils/skyshader');

class Renderer extends ECS.System {

	constructor( width, height) {

		super();

		this.renderer = new THREE.WebGLRenderer();

		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( width, height );

		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000000 );

		this.container = document.createElement( 'div' );
		document.body.appendChild( this.container );
		this.container.appendChild( this.renderer.domElement );

		this.scene = new THREE.Scene();

		this.jsonLoader = new THREE.JSONLoader( this.manager );
	}

	test( entity ) {

		return ( entity.components.model || entity.components.camera )
			&& entity.components.position
		;
	}

	enter( entity ) {

		let {model = false} = entity.components;

		if( model ) {

			this.jsonLoader.load( model.src, ( geometry, materials ) => {

				let mesh = new THREE.Mesh( geometry, materials );
				entity.mesh = mesh;
				mesh.position.set( 0, 0, 0 );
				this.scene.add( mesh );
			} );
		}
	}

	update( entity ) {

		let {position, camera = false} = entity.components;

		if( camera ) {

			let vec3Target = new THREE.Vector3( position.x, position.y, position.z );

			this.camera.position.x = ( vec3Target.x + camera.radius * Math.cos( camera.angle ) );
			this.camera.position.y = ( vec3Target.y );
			this.camera.position.z = ( vec3Target.z + camera.radius * Math.sin( camera.angle ) );

			this.camera.lookAt( vec3Target );
		}

		if( entity.mesh ) {
			entity.mesh.position.set( position.x, position.y, position.z );
		}
	}

	postUpdate() {
		this.renderer.render( this.scene, this.camera );
	}
}

module.exports = Renderer;