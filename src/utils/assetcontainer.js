"use strict";

const THREE = require('three');

const jsonLoader = new THREE.JSONLoader();

const AssetContainer = {
	materials: {},
	geometry: {},
	getMaterial: ( src, cb ) => {
		if( AssetContainer.materials[ src ] ) {
			cb( AssetContainer.materials[ src ] );
			return;
		}
		AssetContainer.loadJSON( src, () => {
			cb( AssetContainer.materials[ src ] );
		} );
	},
	getGeometry: ( src, cb ) => {
		if( AssetContainer.geometry[ src ] ) {
			cb( AssetContainer.geometry[ src ] );
			return;
		}

		AssetContainer.loadJSON( src, () => {
			cb( AssetContainer.geometry[ src ] );
		} );
	},
	loadJSON: ( src, cb ) => {
		jsonLoader.load( src, ( geometry, materials ) => {
			AssetContainer.geometry[ src ] = geometry;
			AssetContainer.materials[ src ] = materials;
			cb();
		} );
	}
};

module.exports = AssetContainer;