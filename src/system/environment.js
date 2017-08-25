"use strict";

const ECS = require('yagl-ecs'),
	THREE = require('three')
;

require('../utils/skyshader');

class Environment extends ECS.System {

	constructor( scene ) {

		super();
		this.scene = scene;
	}

	enter( entity ) {

		let {atmosphere} = entity.components;

		// Sky
		this.sky = new THREE.Sky();
		this.scene.add( this.sky.mesh );

		// Ambient light
		this.ambientLight = new THREE.AmbientLight( atmosphere.ambientLightColor );
		this.scene.add( this.ambientLight );

		// Sun light
		this.sunLight = new THREE.DirectionalLight( atmosphere.sunLightColor );
		this.sunLight.position.set( 0, 0, 0 );
		this.scene.add( this.sunLight );

		// Sun position
		this.sunPosition = new THREE.Vector3();

		this.hemiLight = new THREE.HemisphereLight( atmosphere.hemisphereLightColor[0], atmosphere.hemisphereLightColor[1], atmosphere.hemispherLightIntensity );
		this.scene.add( this.hemiLight );
	}

	test( entity ) {
		return entity.components.atmosphere;
	}

	update( entity ) {

		let {atmosphere} = entity.components;

		this.ambientLight.color.setHex( atmosphere.ambientLightColor );
		this.sunLight.color.setHex( atmosphere.sunLightColor );
		this.hemiLight.color.setHex( atmosphere.hemisphereLightColor[ 0 ] );
		this.hemiLight.groundColor.setHex( atmosphere.hemisphereLightColor[ 1 ] );
		this.hemiLight.intensity = atmosphere.hemisphereLightIntensity;

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

	exit( entity ) {
		this.scene.remove( this.sky.mesh );
		this.scene.remove( this.ambientLight );
		this.scene.remove( this.sunLight );
		this.scene.remove( this.hemiLight );
	}
}

module.exports = Environment;