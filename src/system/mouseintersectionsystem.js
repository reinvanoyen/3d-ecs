"use strict";

const ECS = require('yagl-ecs'),
	THREE = require('three')
;

class MouseIntersectionSystem extends ECS.System {

	constructor( renderer, scene, camera ) {

		super();

		this.camera = camera;
		this.scene = scene;

		this.mouseVec3 = new THREE.Vector2();
		this.raycaster = new THREE.Raycaster();

		this.mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
		this.mouseHelper.visible = false;
		this.scene.add( this.mouseHelper );

		let geometry = new THREE.Geometry();
		geometry.vertices.push( new THREE.Vector3(), new THREE.Vector3() );

		this.line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { linewidth: 4 } ) );
		this.scene.add( this.line );

		renderer.domElement.addEventListener( 'mousemove', ( e ) => {

			this.mouseVec3.x = ( ( e.pageX / e.currentTarget.width ) * 2 - 1 );
			this.mouseVec3.y = - ( e.pageY / e.currentTarget.height ) * 2 + 1;
		} );
	}

	test( entity ) {
		return entity.components.mouseintersectable;
	}

	enter( entity ) {
		// @TODO
	}

	update( entity ) {

		if( entity.mesh ) {

			entity.intersection = {
				intersects: false,
				point: new THREE.Vector3(),
				normal: new THREE.Vector3()
			};

			let intersects = this.raycaster.intersectObjects( [ entity.mesh ] );

			if( intersects.length > 0 ) {

				let p = intersects[0].point;
				this.mouseHelper.position.copy( p );
				entity.intersection.point.copy( p );

				let n = intersects[0].face.normal.clone();
				n.multiplyScalar( 10 );
				n.add( intersects[0].point );

				entity.intersection.normal.copy( intersects[0].face.normal );
				this.mouseHelper.lookAt( n );

				this.line.geometry.vertices[0].copy( entity.intersection.point );
				this.line.geometry.vertices[1].copy( n );
				this.line.geometry.verticesNeedUpdate = true;

				entity.intersection.intersects = true;

			} else {

				entity.intersection.intersects = false;
			}
		}
	}

	postUpdate() {

		this.raycaster.setFromCamera( this.mouseVec3, this.camera );
	}
}

module.exports = MouseIntersectionSystem;