"use strict";

const PhongMaterial = {
	name: 'phongmaterial',
	defaults: {
		envMap: null,
		map: null,
		color: 0xffffff,
		reflectivity: 1,
		specular: 0xffffff,
		shininess: 30
	}
};

module.exports = PhongMaterial;