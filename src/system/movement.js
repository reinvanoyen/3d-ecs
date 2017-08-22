"use strict";

const ECS = require('yagl-ecs'),
	THREE = require('three')
;

class Movement extends ECS.System {

	test( entity ) {

		return entity.components.velocity && entity.components.position;
	}

	update( entity ) {

		let {velocity, position} = entity.components;

		let positionVec3 = new THREE.Vector3( position.x, position.y, position.z );
		let velocityVec3 = new THREE.Vector3( velocity.x, velocity.y, velocity.z );

		let newPositionVec3 = positionVec3.add( velocityVec3 );

		position.x = newPositionVec3.x;
		position.y = newPositionVec3.y;
		position.z = newPositionVec3.z;
	}
}

module.exports = Movement;