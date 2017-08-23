"use strict";

const ECS = require('yagl-ecs'),

	Renderer = require('./system/renderer'),
	Camera = require('./system/camera'),
	Environment = require('./system/environment'),
	Movement = require('./system/movement'),
	Particles = require('./system/particles'),
	MouseSystem = require('./system/mousesystem'),
	DecalSystem = require('./system/decalsystem'),

	Geometry = require('./component/geometry'),
	Sphere = require('./component/sphere'),
	Cube = require('./component/cube'),
	Decal = require('./component/decal'),
	JSONMaterial = require('./component/jsonmaterial'),
	PhongMaterial = require('./component/phongmaterial'),
	Position = require('./component/position'),
	Velocity = require('./component/velocity'),
	Atmosphere = require('./component/atmosphere'),
	Skybox = require('./component/skybox'),
	OrbitCamera = require('./component/orbitcamera'),
	Emitter = require('./component/emitter'),
	Clickable = require('./component/clickable')
;

let ecs = new ECS();

// Systems
let renderer = new Renderer( window.innerWidth, window.innerHeight );

ecs.addSystem( renderer );
ecs.addSystem( new Camera( renderer.camera ) );
ecs.addSystem( new Environment( renderer.scene ) );
ecs.addSystem( new Particles( renderer.scene, renderer.camera ) );
ecs.addSystem( new Movement() );
ecs.addSystem( new DecalSystem( renderer.scene ) );
ecs.addSystem( new MouseSystem( renderer.renderer, renderer.scene, renderer.camera ) );

// Entities

let plane = new ECS.Entity( 0, [
	Geometry,
	PhongMaterial,
	Position,
	Velocity,
	OrbitCamera,
	Clickable,
	Decal
] );

let plane02 = new ECS.Entity( 0, [
	Geometry,
	PhongMaterial,
	Position,
	Velocity,
	Clickable,
	Decal
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

/*
let snow = new ECS.Entity( 0, [
	Position,
	Emitter
] );

snow.updateComponent( 'emitter', {
	amount: 200,
	width: 2,
	height: 2,
	depth: 2,
	particleSize: 1,
	maxVY: 0.5,
	minVY: 0.2,
	maxVX: -0.1,
	minVX: 0.1,
	boundWidth: 40,
	boundHeight: 100,
	boundDepth: 40,
	boundReaction: 1
} );
*/

// snow.updateComponent( 'position', {
// 	y: 50
// } );

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

plane02.updateComponent( 'position', {
	x: -4
} );

plane.updateComponent( 'orbitcamera', {
	radius: 10,
	translateY: 3
} );

plane.updateComponent( 'phongmaterial', {
	shininess: 0,
	specular: 0,
	reflectivity: 0.2,
	envMap: 'assets/textures/reflection.jpg'
} );

plane02.updateComponent( 'phongmaterial', {
	shininess: 0,
	specular: 0,
	reflectivity: 0.2,
	envMap: 'assets/textures/reflection.jpg'
} );

atmosphere.updateComponent( 'atmosphere', {
	turbidity: 11,
	reyleigh: 2.8,
	luminance: 1.1,
	inclination: 0.3,
	azimuth: 0.125
} );

ecs.addEntity( plane );
ecs.addEntity( plane02 );
// ecs.addEntity( snow );
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

let isDragging = false;

// window.addEventListener( 'mousedown', e => {
//
// 	plane.updateComponent( 'orbitcamera', {
// 		angleX: plane.components.orbitcamera.angleX + 0.1,
// 		angleY: plane.components.orbitcamera.angleY + 0.1
// 	} );
// } );

/*
window.addEventListener( 'mousemove', e => {

	plane.updateComponent( 'orbitcamera', {
		angleX: e.clientX / 1000
	} );
} );
*/

window.addEventListener( 'mousewheel', e => {

	plane.updateComponent( 'orbitcamera', {
		radius: plane.components.orbitcamera.radius + .5,
	} );
} );

// Animation loop
let angle = 0;
function animate() {

	angle += 0.005;

	plane.updateComponent( 'orbitcamera', {
		angleX: angle
	} );

	if( plane.components.clickable.clicked ) {

		plane.updateComponent( 'phongmaterial', {
			color: Math.random() * 0xffffff,
			specular: Math.random() * 0xffffff,
			shininess: Math.random() * 50,
			reflectivity: Math.random()
		} );
	}

	if( plane02.components.clickable.clicked ) {

		plane02.updateComponent( 'phongmaterial', {
			color: Math.random() * 0xffffff,
			specular: Math.random() * 0xffffff,
			shininess: Math.random() * 50,
			reflectivity: Math.random()
		} );
	}

	requestAnimationFrame( animate );
	ecs.update();
}

animate();