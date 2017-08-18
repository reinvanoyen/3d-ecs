"use strict";

const ECS = require('yagl-ecs'),
	Renderer = require('./system/renderer'),
	Atmosphere = require('./system/atmosphere'),
	Model = require('./component/model'),
	Position = require('./component/position'),
	Sky = require('./component/sky'),
	Camera = require('./component/camera')
;

let ecs = new ECS();

// Systems
let renderer = new Renderer( window.innerWidth, window.innerHeight );

ecs.addSystem( renderer );
ecs.addSystem( new Atmosphere( renderer.scene ) );

// Entities

let entity01 = new ECS.Entity( 0, [
	Model,
	Position,
	Camera
] );

let sky = new ECS.Entity( 0, [
	Sky
] );

entity01.updateComponent( 'position', { x: 0, y: 0, z: 0 } );
entity01.updateComponent( 'model', { src: 'assets/model/texture_space.json' } );
entity01.updateComponent( 'camera', { radius: 50 } );

ecs.addEntity( entity01 );
ecs.addEntity( sky );

// Animation loop

let angle = 0;

function animate() {

	angle += .001;

	sky.updateComponent( 'sky', { azimuth: Math.sin( angle ) } );
	entity01.updateComponent( 'camera', { angle: Math.cos( angle ) } );

	requestAnimationFrame( animate );
	ecs.update();
}

animate();