"use strict";

const Emitter = {
	name: 'emitter',
	defaults: {
		textureSrc: 'assets/textures/cloud.png',
		particleSize: 100,
		amount: 50,
		width: 50,
		height: 50,
		depth: 50,
		minVX: 0,
		maxVX: 0,
		minVY: 0,
		maxVY: 0,
		minVZ: 0,
		maxVZ: 0
	}
};

module.exports = Emitter;