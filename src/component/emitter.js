"use strict";

const BOUND_VELOCITY_REVERSE = 0;
const BOUND_RESET_POSITION = 1;

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
		maxVZ: 0,
		useBounds: true,
		boundWidth: 50,
		boundHeight: 50,
		boundDepth: 50,
		boundReaction: BOUND_VELOCITY_REVERSE
	}
};

module.exports = Emitter;