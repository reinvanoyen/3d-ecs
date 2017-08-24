"use strict";

const ECS = require('yagl-ecs'),
	THREE = require('three')
;

class MouseSystem extends ECS.System {

	constructor( renderer, scene, camera ) {

		super();

		this.renderer = renderer;
		this.camera = camera;
		this.scene = scene;

		this.mouseVec3 = new THREE.Vector2();
		this.raycaster = new THREE.Raycaster();

		this.mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
		this.mouseHelper.visible = false;
		this.scene.add( this.mouseHelper );

		this.renderer.domElement.addEventListener( 'mousemove', ( e ) => {

			this.mouseVec3.x = ( ( ( e.pageX - e.currentTarget.offsetLeft ) / e.currentTarget.width ) * 2 - 1 );
			this.mouseVec3.y = - ( ( e.pageY - e.currentTarget.offsetTop ) / e.currentTarget.height ) * 2 + 1;
		} );
	}

	test( entity ) {
		return entity.components.clickable;
	}

	enter( entity ) {

		this.renderer.domElement.addEventListener( 'mouseup', ( e ) => {

			this.raycaster.setFromCamera( this.mouseVec3, this.camera );
			this.checkIntersection( entity );
		} );
	}

	checkIntersection( entity ) {

		let {clickable} = entity.components;

		if( entity.mesh ) {

			let intersects = this.raycaster.intersectObjects( [ entity.mesh ] );

			if( intersects.length > 0 ) {

				let p = intersects[0].point;
				this.mouseHelper.position.copy( p );

				let n = intersects[0].face.normal.clone();
				n.add( intersects[0].point );

				this.mouseHelper.lookAt( n );

				clickable.clicked = true;
				clickable.x = p.x;
				clickable.y = p.y;
				clickable.z = p.z;
				clickable.orientation = this.mouseHelper.rotation;
			}
		}
	}

	update( entity ) {

		entity.components.clickable.clicked = false;
	}
}

module.exports = MouseSystem;