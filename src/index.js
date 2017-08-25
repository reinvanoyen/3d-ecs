"use strict";

const $ = require( 'jquery' ),
	StepInterface = require('./ui/stepinterface'),
	Step = require('./ui/step'),
	DecalPicker = require('./ui/decalpicker'),
	BatchEntitySwitcher = require('./utils/batchentityswitcher'),

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

let batchEntitySwitcher = new BatchEntitySwitcher( ecs );

// Entities

let plane = new ECS.Entity( 0, [
	Geometry,
	PhongMaterial,
	Position,
	Velocity,
	OrbitCamera
] );

let defaultAtmosphere = new ECS.Entity( 0, [ Atmosphere ] );
let eveningAtmosphere = new ECS.Entity( 0, [ Atmosphere ] );

defaultAtmosphere.updateComponent( 'atmosphere', {
	turbidity: 11,
	reyleigh: 2.8,
	luminance: 1.1,
	inclination: 0.3,
	azimuth: 0.125,
	ambientLightColor: 0x24353E,
	sunLightColor: 0xFBFCE8,
	hemisphereLightColor: [ 0x24353E, 0xffffff ],
	hemisphereLightIntensity: 0.6
} );

eveningAtmosphere.updateComponent( 'atmosphere', {
	turbidity: 11,
	reyleigh: 2.8,
	luminance: 0.7,
	inclination: 0.5,
	azimuth: 0.125,
	ambientLightColor: 0x301408,
	sunLightColor: 0xc98600,
	hemisphereLightColor: [ 0x0c876e, 0xb74905 ],
	hemisphereLightIntensity: 0.1
} );


let cloudLayer = new ECS.Entity( 'clouds', [
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

let eveningClouds = new ECS.Entity( 0, [
	Position,
	Emitter
] );

eveningClouds.updateComponent( 'emitter', {
	amount: 100,
	width: 500,
	height: 5,
	depth: 500,
	particleSize: 100,
	maxVX: 0.01,
	maxVY: 0.01,
	maxVZ: 0.01,
	boundWidth: 500,
	boundHeight: 5,
	boundDepth: 500
} );

// Set batches

batchEntitySwitcher.addBatch( 'defaultsky', [
	defaultAtmosphere,
	cloudLayer02,
	cloudLayer
] );

batchEntitySwitcher.addBatch( 'eveningsky', [
	eveningClouds,
	eveningAtmosphere
] );

batchEntitySwitcher.addBatch( 'morningsky', [
	eveningClouds,
	defaultAtmosphere
] );

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

ecs.addEntity( plane );

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

	requestAnimationFrame( animate );
	ecs.update();
}

animate();

// Interface

let stepInterface = new StepInterface();

let stepLogo = new Step( 'Logo', 'assets/svg/lol.svg', () => {

	plane.addComponent( 'clickable', Clickable.defaults );
	plane.addComponent( 'decal', Decal.defaults );

	let decalPicker = new DecalPicker( img => decalsystem.setTextureFromImage( img ) );

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

			batchEntitySwitcher.setBatch( 'defaultsky' );
		} )
	;

	let $sky02 = $( '<button>' )
		.text( 'Summer evening' )
		.click( e => {

			batchEntitySwitcher.setBatch( 'eveningsky' );
		} )
	;

	let $sky03 = $( '<button>' )
		.text( 'Sundaaay morrrning' )
		.click( e => {

			batchEntitySwitcher.setBatch( 'morningsky' );
		} )
	;

	let $container = $( '<div>' )
		.append( $sky01 )
		.append( $sky02 )
		.append( $sky03 )
	;

	return $container;

}, () => {


} );

stepInterface.addStep( stepSky );
stepInterface.addStep( stepLogo );

$( 'body' ).append( stepInterface.build() );

stepInterface.$content.append( renderer.container );