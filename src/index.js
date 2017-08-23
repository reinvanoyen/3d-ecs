"use strict";

const ECS = require('yagl-ecs'),
	Renderer = require('./system/renderer'),
	Camera = require('./system/camera'),
	Environment = require('./system/environment'),
	Movement = require('./system/movement'),
	Particles = require('./system/particles'),
	MouseIntersectionSystem = require('./system/mouseintersectionsystem'),
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
	Emitter = require('./component/emitter'),
	MouseIntersectable = require('./component/mouseintersectable')
;

let ecs = new ECS();

// Systems
let renderer = new Renderer( window.innerWidth, window.innerHeight );

ecs.addSystem( renderer );
ecs.addSystem( new Camera( renderer.camera ) );
ecs.addSystem( new Environment( renderer.scene ) );
ecs.addSystem( new Particles( renderer.scene, renderer.camera ) );
ecs.addSystem( new Movement() );
ecs.addSystem( new MouseIntersectionSystem( renderer.renderer, renderer.scene, renderer.camera ) );

// Entities

let plane = new ECS.Entity( 0, [
	Geometry,
	PhongMaterial,
	Position,
	Velocity,
	OrbitCamera,
	MouseIntersectable
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

let snow = new ECS.Entity( 0, [
	Position,
	Emitter
] );

snow.updateComponent( 'emitter', {
	amount: 1000,
	width: 500,
	height: 500,
	depth: 500,
	particleSize: 5,
	maxVY: -1,
	minVY: -0.02,
	maxVX: -0.03,
	minVX: 0.03,
	boundWidth: 500,
	boundHeight: 500,
	boundDepth: 500,
	boundReaction: 1
} );

snow.updateComponent( 'position', {
	y: 50
} );

cloudLayer.updateComponent( 'emitter', {
	amount: 100,
	width: 500,
	height: 5,
	depth: 500,
	particleSize: 150,
	maxVX: 0.05,
	maxVY: 0.02,
	maxVZ: 0.03,
	boundWidth: 500,
	boundHeight: 5,
	boundDepth: 500
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
	particleSize: 150,
	boundWidth: 500,
	boundHeight: 6,
	boundDepth: 500
} );

cloudLayer02.updateComponent( 'position', {
	y: -20
} );

plane.updateComponent( 'orbitcamera', {
	radius: 20
} );

plane.updateComponent( 'phongmaterial', {
	shininess: 0,
	specular: 0,
	reflectivity: 0.2,
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
ecs.addEntity( snow );
ecs.addEntity( cloudLayer02 );
ecs.addEntity( cloudLayer );
ecs.addEntity( atmosphere );

// Event listeners

/*
let cameraInput = document.createElement( 'input' );
cameraInput.setAttribute( 'type', 'range' );
cameraInput.setAttribute( 'min', -100 );
cameraInput.setAttribute( 'max', 100 );
document.body.appendChild( cameraInput );

cameraInput.addEventListener( 'change', e => {

	plane.updateComponent( 'orbitcamera', {
		angleX: cameraInput.value / 100 * 360,
	} );
} );
*/

window.addEventListener( 'mousemove', e => {

	plane.updateComponent( 'orbitcamera', {
		angleX: e.clientX / 300,
		angleY: e.clientY / 300
	} );
} );

window.addEventListener( 'click', e => {

	plane.updateComponent( 'phongmaterial', {
		color: 0x9dff00,
		reflectivity: 1
	} );
} );

// Animation loop

function animate() {

	requestAnimationFrame( animate );
	ecs.update();
}

animate();