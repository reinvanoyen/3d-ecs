"use strict";

const Atmosphere = {
	name: 'atmosphere',
	defaults: {
		turbidity: 10,
		rayleigh: 2,
		mieCoefficient: 0.005,
		mieDirectionalG: 0.8,
		luminance: 1,
		inclination: .49,
		azimuth: .25,
		ambientLightColor: 0x24353E,
		sunLightColor: 0xFBFCE8,
		hemisphereLightColor: [ 0x24353E, 0xffffff ],
		hemisphereLightIntensity: 0.6
	}
};

module.exports = Atmosphere;