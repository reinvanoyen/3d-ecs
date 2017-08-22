"use strict";

const ECS = require('yagl-ecs'),
	THREE = require('three')
;

require('../utils/skyshader');

class Environment extends ECS.System {

	constructor( scene ) {

		super();
		this.scene = scene;

		// Sky
		this.sky = new THREE.Sky();
		this.scene.add( this.sky.mesh );

		// Ambient light
		this.ambient = new THREE.AmbientLight( 0x24353E );
		this.scene.add( this.ambient );

		// Sun light
		this.sunLight = new THREE.DirectionalLight( 0xedb547 );
		this.sunLight.position.set( 0, 0, 0 );
		this.scene.add( this.sunLight );

		// Sun position
		this.sunPosition = new THREE.Vector3();

		let hemiLight = new THREE.HemisphereLight( 0xf35938, 0xf35938, 0.6 );
		this.scene.add( hemiLight );
	}

	test( entity ) {
		return entity.components.atmosphere;
	}

	update( entity ) {

		let {atmosphere} = entity.components;

		let theta = Math.PI * ( atmosphere.inclination - 0.5 );
		let phi = 2 * Math.PI * ( atmosphere.azimuth - 0.5 );

		let uniforms = this.sky.uniforms;

		uniforms.turbidity.value = atmosphere.turbidity;
		uniforms.rayleigh.value = atmosphere.rayleigh;
		uniforms.luminance.value = atmosphere.luminance;
		uniforms.mieCoefficient.value = atmosphere.mieCoefficient;
		uniforms.mieDirectionalG.value = atmosphere.mieDirectionalG;

		this.sunPosition.x = 400000 * Math.cos( phi );
		this.sunPosition.y = 400000 * Math.sin( phi ) * Math.sin( theta );
		this.sunPosition.z = 400000 * Math.sin( phi ) * Math.cos( theta );

		uniforms.sunPosition.value.copy( this.sunPosition );
		this.sunLight.position.copy( this.sunPosition );
	}
}

module.exports = Environment;