"use strict";

const ECS = require('yagl-ecs'),
	THREE = require('three'),
	AssetContainer = require('../utils/assetcontainer')
;

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
	}

	test( entity ) {

		return (
				entity.components.geometry ||
				entity.components.sphere
			)
			&& entity.components.position
		;
	}

	addMeshToScene( entity, geometry, material ) {

		let mesh = new THREE.Mesh( geometry, material );
		entity.mesh = mesh;
		mesh.position.set( 0, 0, 0 );
		this.scene.add( mesh );
	}

	getGeometry( entity, cb ) {

		let { geometry = false, sphere = false, cube = false } = entity.components;

		if( geometry ) {
			AssetContainer.getGeometry( geometry.src, ( geo ) => {
				cb( geo );
			} );
			return;
		}

		if( sphere ) {
			cb( new THREE.SphereGeometry( sphere.radius, 64, 64 ) );
			return;
		}

		if( cube ) {
			cb( new THREE.CubeGeometry( cube.width, cube.height, cube.depth, 1, 1 ) );
			return;
		}
	}

	getMaterial( entity, cb ) {

		let { jsonmaterial = false, phongmaterial = false, skybox = false } = entity.components;

		if( jsonmaterial ) {

			AssetContainer.getMaterial( jsonmaterial.src, ( mtl ) => {
				cb( mtl );
				return;
			} );
		}

		if( phongmaterial ) {

			let mtl = new THREE.MeshPhongMaterial( {
				color: phongmaterial.color,
				specular: phongmaterial.specular,
				shininess: phongmaterial.shininess,
				reflectivity: phongmaterial.reflectivity
			} );

			if( phongmaterial.envMap ) {

				// @TODO improve
				let textureLoader = new THREE.TextureLoader();
				let envMap = textureLoader.load( phongmaterial.envMap );
				envMap.mapping = THREE.EquirectangularReflectionMapping;
				//textureEquirec.magFilter = THREE.LinearFilter;
				//textureEquirec.minFilter = THREE.LinearMipMapLinearFilter;
				mtl.setValues( { envMap: envMap } );
			}

			if( phongmaterial.map ) {

				let textureLoader = new THREE.TextureLoader();
				let map = textureLoader.load( phongmaterial.map );
				mtl.setValues( { map: map } );
			}

			cb( mtl );
			return;
		}

		if( skybox ) {

			// @TODO improve ??? (or remove all together)
			let materialArray = [];
			[ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ].forEach( src => {
				materialArray.push( new THREE.MeshBasicMaterial( {
					transparent: true,
					alphaMap: new THREE.TextureLoader().load( skybox.path + src ),
					map: new THREE.TextureLoader().load( skybox.path + src ),
					side: THREE.BackSide
				} ) );
			} );

			cb( materialArray );
			return;
		}

		cb( new THREE.MeshPhongMaterial() );
	}

	enter( entity ) {

		this.getGeometry( entity, ( geometry ) => {

			this.getMaterial( entity, ( material ) => {

				this.addMeshToScene( entity, geometry, material );
			} );
		} );
	}

	update( entity ) {

		let { position, phongmaterial = false } = entity.components;

		if( entity.mesh ) {

			entity.mesh.position.set( position.x, position.y, position.z );

			if( phongmaterial ) {

				entity.mesh.material.setValues( {
					color: phongmaterial.color,
					specular: phongmaterial.specular,
					shininess: phongmaterial.shininess,
					reflectivity: phongmaterial.reflectivity
				} );
			}
		}
	}

	postUpdate() {

		this.renderer.render( this.scene, this.camera );
	}
}

module.exports = Renderer;