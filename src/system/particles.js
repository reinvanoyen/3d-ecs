"use strict";

const ECS = require('yagl-ecs'),
	THREE = require('three'),
	MathUtils = require('../utils/math')
;

class Particles extends ECS.System {

	constructor( scene, camera ) {
		super();
		this.scene = scene;
		this.camera = camera;
	}

	test( entity ) {
		return entity.components.emitter && entity.components.position;
	}

	enter( entity ) {

		let {emitter, position} = entity.components;

		let texture = new THREE.TextureLoader().load( emitter.textureSrc );
		texture.magFilter = THREE.LinearMipMapLinearFilter;
		texture.minFilter = THREE.LinearMipMapLinearFilter;

		// create the particle variables
		let particles = new THREE.Geometry(),
			pMaterial = new THREE.PointsMaterial( {
				color: 0xFFFFFF,
				size: emitter.particleSize,
				map: texture,
				transparent: true,
				depthTest: true,
				depthWrite: false
			} );

		// now create the individual particles
		for( let p = 0; p < entity.components.emitter.amount; p++ ) {

			// create a particle with random
			let pX = Math.random() * emitter.width - emitter.width / 2,
				pY = Math.random() * emitter.height - emitter.height / 2,
				pZ = Math.random() * emitter.depth - emitter.depth / 2
			;

			let particle = new THREE.Vector3( pX, pY, pZ );

			// create a velocity vector
			particle.velocity = new THREE.Vector3( 0, 0, -Math.random() );

			// add it to the geometry
			particles.vertices.push( particle );
		}

		// create the particle system
		let particleSystem = new THREE.Points( particles, pMaterial );

		particleSystem.position.set( 0, -15, 0 );

		// add it to the scene
		particleSystem.sortParticles = true;
		entity.particles = particles;
		entity.particleSystem = particleSystem;
		this.scene.add( particleSystem );
	}

	update( entity ) {

		let {emitter, position} = entity.components;

		if( entity.particles ) {

			let pCount = emitter.amount;

			while( pCount-- ) {

				// get the particle
				let particle = entity.particles.vertices[ pCount ];

				// and the position
				particle = particle.add( particle.velocity );
			}

			entity.particleSystem.position.set( position.x, position.y, position.z );
			entity.particleSystem.geometry.verticesNeedUpdate = true;
		}
	}
}

module.exports = Particles;