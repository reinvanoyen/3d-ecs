
"use strict";

const ECS = require('yagl-ecs'),
	THREE = require('three')
;

class Camera extends ECS.System {

	constructor( camera ) {

		super();
		this.camera = camera;
	}

	test( entity ) {
		return ( entity.components.orbitcamera || entity.components.thirdpersoncamera ) && entity.components.position;
	}

	update( entity ) {

		let {position, orbitcamera = false, thirdpersoncamera = false} = entity.components;

		if( orbitcamera ) {

			let vec3Target = new THREE.Vector3( position.x, position.y, position.z );

			this.camera.position.x = ( vec3Target.x + orbitcamera.radius * Math.cos( orbitcamera.angleX ) );
			this.camera.position.y = ( vec3Target.y + orbitcamera.radius * Math.cos( orbitcamera.angleY ) );
			this.camera.position.z = ( vec3Target.z + orbitcamera.radius * Math.sin( orbitcamera.angleX ) );

			this.camera.lookAt( vec3Target );

		} else if( thirdpersoncamera ) {

			let vec3Target = new THREE.Vector3( position.x, position.y, position.z );
			this.camera.position.z = ( vec3Target.z + thirdpersoncamera.distance );
			this.camera.lookAt( vec3Target );
		}
	}
}

module.exports = Camera;