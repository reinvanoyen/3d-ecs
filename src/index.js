"use strict";

const $ = require( 'jquery' ),
	StepInterface = require('./ui/stepinterface'),
	Step = require('./ui/step'),
	DecalPicker = require('./ui/decalpicker'),

	// Entity Component System
	ECS = require('yagl-ecs'),

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
let decalsystem = new DecalSystem( renderer.scene );

ecs.addSystem( renderer );
ecs.addSystem( new Camera( renderer.camera ) );
ecs.addSystem( new Environment( renderer.scene ) );
ecs.addSystem( new Particles( renderer.scene, renderer.camera ) );
ecs.addSystem( new Movement() );
ecs.addSystem( decalsystem );
ecs.addSystem( new MouseSystem( renderer.renderer, renderer.scene, renderer.camera ) );

// Entities

let plane = new ECS.Entity( 0, [
	Geometry,
	PhongMaterial,
	Position,
	Velocity,
	OrbitCamera
] );

let atmosphere = new ECS.Entity( 0, [ Atmosphere ] );

let cloudLayer = new ECS.Entity( 'clouds', [
	Position,
	Emitter
] );

let cloudLayer02 = new ECS.Entity( 0, [
	Position,
	Emitter
] );

let eveningClouds = new ECS.Entity( 0, [
	Position,
	Emitter
] );

// snow.updateComponent( 'position', {
// 	y: 50
// } );

eveningClouds.updateComponent( 'emitter', {
	amount: 10,
	width: 500,
	height: 5,
	depth: 500,
	particleSize: 100,
	maxVX: 0.02,
	maxVY: 0.02,
	maxVZ: 0.02,
	boundWidth: 500,
	boundHeight: 5,
	boundDepth: 500
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
	radius: 10,
	translateY: 3
} );

plane.updateComponent( 'phongmaterial', {
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
ecs.addEntity( cloudLayer02 );
ecs.addEntity( cloudLayer );
ecs.addEntity( atmosphere );

window.addEventListener( 'mousewheel', e => {

	plane.updateComponent( 'orbitcamera', {
		radius: plane.components.orbitcamera.radius + .5,
	} );
} );

let saveButton = document.createElement( 'button' );
saveButton.textContent = 'Take photo!';

saveButton.addEventListener( 'click', e => {

	let img = document.createElement( 'img' );
	img.src = renderer.getSnapshot();
	document.body.appendChild( img );
} );

document.body.appendChild( saveButton );

// Animation loop
let angle = 0;
function animate() {

	angle += 0.005;

	plane.updateComponent( 'orbitcamera', {
		angleX: angle
	} );
	//
	// if( plane.components.clickable && plane.components.clickable.clicked ) {
	//
	// 	plane.updateComponent( 'phongmaterial', {
	// 		color: Math.random() * 0xffffff,
	// 		specular: Math.random() * 0xffffff,
	// 		shininess: Math.random() * 50,
	// 		reflectivity: Math.random()
	// 	} );
	// }

	requestAnimationFrame( animate );
	ecs.update();
}

animate();

// Interface

let stepInterface = new StepInterface();

let stepLogo = new Step( 'Logo', 'assets/svg/lol.svg', () => {

	plane.addComponent( 'clickable', Clickable.defaults );
	plane.addComponent( 'decal', Decal.defaults );

	let decalPicker = new DecalPicker( img => {

		console.log( 'picked image' );
		decalsystem.setTextureFromImage( img );
	} );

	decalPicker.addDecal( 'assets/textures/logo.png' );
	decalPicker.addDecal( 'assets/textures/logo.png' );
	decalPicker.addDecal( 'assets/textures/logo.png' );
	decalPicker.addDecal( 'assets/textures/logo.png' );
	decalPicker.addDecal( 'assets/textures/logo.png' );
	decalPicker.addDecal( 'assets/textures/logo.png' );
	decalPicker.addDecal( 'assets/textures/logo.png' );

	return decalPicker.build();

}, () => {

	plane.removeComponent( 'clickable' );
	plane.removeComponent( 'decal' );
} );

let stepSky = new Step( 'Sky', 'assets/svg/lol.svg', () => {

	let $sky01 = $( '<button>' )
		.text( 'Summer noon' )
		.click( e => {

			atmosphere.updateComponent( 'atmosphere', {
				turbidity: 11,
				reyleigh: 2.8,
				luminance: 1.1,
				inclination: 0.3,
				azimuth: 0.125
			} );
		} )
	;

	let $sky02 = $( '<button>' )
		.text( 'Summer evening' )
		.click( e => {

			ecs.removeEntity( cloudLayer );
			ecs.removeEntity( cloudLayer02 );
			ecs.addEntity( eveningClouds );

			atmosphere.updateComponent( 'atmosphere', {
				turbidity: 10,
				reyleigh: 2,
				luminance: 1,
				inclination: 0.5,
				azimuth: 0.25
			} );
		} )
	;

	let $container = $( '<div>' )
		.append( $sky01 )
		.append( $sky02 )
	;

	return $container;

}, () => {


} );

stepInterface.addStep( stepLogo );
stepInterface.addStep( stepSky );

$( 'body' ).append( stepInterface.build() );

//stepInterface.$content.append( renderer.container );