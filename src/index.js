"use strict";

const ECS = require('yagl-ecs'),
	Renderer = require('./system/renderer'),
	Atmosphere = require('./system/atmosphere'),
	Particles = require('./system/particles'),
	Geometry = require('./component/geometry'),
	Sphere = require('./component/sphere'),
	Cube = require('./component/cube'),
	JSONMaterial = require('./component/jsonmaterial'),
	PhongMaterial = require('./component/phongmaterial'),
	Position = require('./component/position'),
	Sky = require('./component/sky'),
	Skybox = require('./component/skybox'),
	Camera = require('./component/camera'),
	Emitter = require('./component/emitter')
;

let ecs = new ECS();

// Systems
let renderer = new Renderer( window.innerWidth, window.innerHeight );

ecs.addSystem( renderer );
ecs.addSystem( new Atmosphere( renderer.scene ) );
ecs.addSystem( new Particles( renderer.scene, renderer.camera ) );

// Entities

let plane = new ECS.Entity( 0, [
	Geometry,
	PhongMaterial,
	Position,
	Camera
] );

let sky = new ECS.Entity( 0, [
	Sky
] );

/*
let skybox = new ECS.Entity( 0, [
	Cube,
	Position,
	Skybox,
	Camera
] );
*/

let particleEmitter = new ECS.Entity( 0, [
	Position,
	Emitter
] );

let particleEmitter02 = new ECS.Entity( 0, [
	Position,
	Emitter
] );

particleEmitter.updateComponent( 'emitter', {
	amount: 100,
	width: 500,
	height: 5,
	depth: 500,
	particleSize: 150
} );

particleEmitter.updateComponent( 'position', {
	y: -20
} );

particleEmitter02.updateComponent( 'emitter', {
	textureSrc: 'assets/textures/cloud02.png',
	amount: 500,
	width: 500,
	height: 6,
	depth: 500,
	particleSize: 150
} );

particleEmitter02.updateComponent( 'position', {
	y: -20
} );

plane.updateComponent( 'geometry', { src: 'assets/model/texture_space.json' } );
plane.updateComponent( 'position', { x: 0, y: 0, z: 0 } );
plane.updateComponent( 'phongmaterial', { envMap: 'assets/textures/skybox/nz.jpg' } );

/*
skybox.updateComponent( 'cube', { width: 1000, height: 1000, depth: 1000 } );
skybox.updateComponent( 'camera', { radius: 100 } );
*/

sky.updateComponent( 'sky', {
	turbidity: 11,
	reyleigh: 2.8,
	luminance: 1.1,
	inclination: 0.3,
	azimuth: 0.125
} );

ecs.addEntity( plane );
ecs.addEntity( particleEmitter02 );
//ecs.addEntity( skybox );
ecs.addEntity( particleEmitter );
ecs.addEntity( sky );

// Animation loop

window.addEventListener( 'mousemove', e => {

	plane.updateComponent( 'camera', {
		angle: e.clientX / 300
	} );
} );

let angle = 0;

function animate() {

	angle += .01;
	requestAnimationFrame( animate );
	ecs.update();
}

animate();