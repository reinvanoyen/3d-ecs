"use strict";

const ECS = require('yagl-ecs'),
	THREE = require('three')
;

require('../utils/skyshader');

class Atmosphere extends ECS.System {

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
	}

	test( entity ) {
		return entity.components.sky;
	}

	update( entity ) {

		let {sky} = entity.components;

		let theta = Math.PI * ( sky.inclination - 0.5 );
		let phi = 2 * Math.PI * ( sky.azimuth - 0.5 );

		let uniforms = this.sky.uniforms;

		uniforms.turbidity.value = sky.turbidity;
		uniforms.rayleigh.value = sky.rayleigh;
		uniforms.luminance.value = sky.luminance;
		uniforms.mieCoefficient.value = sky.mieCoefficient;
		uniforms.mieDirectionalG.value = sky.mieDirectionalG;

		this.sunPosition.x = 400000 * Math.cos( phi );
		this.sunPosition.y = 400000 * Math.sin( phi ) * Math.sin( theta );
		this.sunPosition.z = 400000 * Math.sin( phi ) * Math.cos( theta );

		uniforms.sunPosition.value.copy( this.sunPosition );
		this.sunLight.position.copy( this.sunPosition );
	}
}

module.exports = Atmosphere;