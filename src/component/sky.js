"use strict";

const Sky = {
	name: 'sky',
	defaults: {
		turbidity: 10,
		rayleigh: 2,
		mieCoefficient: 0.005,
		mieDirectionalG: 0.8,
		luminance: 1,
		inclination: .49,
		azimuth: .25
	}
};

module.exports = Sky;