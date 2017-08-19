"use strict";

const ECS = require('yagl-ecs'),
	Renderer = require('./system/renderer'),
	Atmosphere = require('./system/atmosphere'),
	Geometry = require('./component/geometry'),
	Sphere = require('./component/sphere'),
	Cube = require('./component/cube'),
	JSONMaterial = require('./component/jsonmaterial'),
	PhongMaterial = require('./component/phongmaterial'),
	Position = require('./component/position'),
	Sky = require('./component/sky'),
	Skybox = require('./component/skybox'),
	Camera = require('./component/camera')
;

let ecs = new ECS();

// Systems
let renderer = new Renderer( window.innerWidth, window.innerHeight );

ecs.addSystem( renderer );
ecs.addSystem( new Atmosphere( renderer.scene ) );

// Entities

let plane = new ECS.Entity( 0, [
	Geometry,
	PhongMaterial,
	Position
] );

let sky = new ECS.Entity( 0, [
	Sky
] );

let skybox = new ECS.Entity( 0, [
	Cube,
	Position,
	Skybox,
	Camera
] );

plane.updateComponent( 'position', { x: 1, y: 0, z: -5 } );
plane.updateComponent( 'phongmaterial', { envMap: 'assets/textures/skybox/nz.jpg' } );

skybox.updateComponent( 'cube', { width: 100, height: 100, depth: 100 } );
skybox.updateComponent( 'camera', { radius: 30 } );

sky.updateComponent( 'sky', {
	turbidity: 11,
	reyleigh: 2.8,
	luminance: 1.1,
	inclination: 0.5,
	azimuth: 0.125
} );

ecs.addEntity( plane );
ecs.addEntity( skybox );
ecs.addEntity( sky );

// Animation loop

window.addEventListener( 'mousemove', e => {

	skybox.updateComponent( 'camera', {
		angle: e.clientX / 300
	} );
} );

let angle = 0;

function animate() {

	angle += .01;
	sky.updateComponent( 'sky', { inclination: Math.sin( angle ) } );
	requestAnimationFrame( animate );
	ecs.update();
}

animate();