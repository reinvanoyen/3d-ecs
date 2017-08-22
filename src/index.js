"use strict";

const ECS = require('yagl-ecs'),
	Renderer = require('./system/renderer'),
	Camera = require('./system/camera'),
	Environment = require('./system/environment'),
	Movement = require('./system/movement'),
	Particles = require('./system/particles'),
	Geometry = require('./component/geometry'),
	Sphere = require('./component/sphere'),
	Cube = require('./component/cube'),
	JSONMaterial = require('./component/jsonmaterial'),
	PhongMaterial = require('./component/phongmaterial'),
	Position = require('./component/position'),
	Velocity = require('./component/velocity'),
	Atmosphere = require('./component/atmosphere'),
	Skybox = require('./component/skybox'),
	OrbitCamera = require('./component/orbitcamera'),
	Emitter = require('./component/emitter')
;

let ecs = new ECS();

// Systems
let renderer = new Renderer( window.innerWidth, window.innerHeight );

ecs.addSystem( renderer );
ecs.addSystem( new Camera( renderer.camera ) );
ecs.addSystem( new Environment( renderer.scene ) );
ecs.addSystem( new Particles( renderer.scene, renderer.camera ) );
ecs.addSystem( new Movement() );

// Entities

let plane = new ECS.Entity( 0, [
	Geometry,
	PhongMaterial,
	Position,
	Velocity,
	OrbitCamera
] );

let atmosphere = new ECS.Entity( 0, [ Atmosphere ] );

let cloudLayer = new ECS.Entity( 0, [
	Position,
	Emitter
] );

let cloudLayer02 = new ECS.Entity( 0, [
	Position,
	Emitter
] );

cloudLayer.updateComponent( 'emitter', {
	amount: 100,
	width: 500,
	height: 5,
	depth: 500,
	particleSize: 150,
	maxVX: 0.05,
	maxVY: 0.02,
	maxVZ: 0.03
} );

cloudLayer.updateComponent( 'position', {
	y: -20
} );

cloudLayer02.updateComponent( 'emitter', {
	textureSrc: 'assets/textures/cloud02.png',
	amount: 500,
	width: 500,
	height: 6,
	depth: 500,
	particleSize: 150
} );

cloudLayer02.updateComponent( 'position', {
	y: -20
} );

plane.updateComponent( 'velocity', {
	z: 1
} );

plane.updateComponent( 'orbitcamera', {
	radius: 20
} );

plane.updateComponent( 'phongmaterial', {
	shininess: 0,
	specular: 0,
	envMap: 'assets/textures/skybox/nz.jpg'
} );

atmosphere.updateComponent( 'atmosphere', {
	turbidity: 11,
	reyleigh: 2.8,
	luminance: 1.1,
	inclination: 0.3,
	azimuth: 0.125
} );

ecs.addEntity( plane );
ecs.addEntity( cloudLayer02 );
ecs.addEntity( cloudLayer );
ecs.addEntity( atmosphere );

// Event listeners

window.addEventListener( 'mousemove', e => {

	plane.updateComponent( 'orbitcamera', {
		angleX: e.clientX / 300,
		angleY: e.clientY / 300
	} );
} );

window.addEventListener( 'click', e => {

	plane.updateComponent( 'phongmaterial', {
		color: 0x9dff00
	} );
} );

// Animation loop

function animate() {

	requestAnimationFrame( animate );
	ecs.update();
}

animate();