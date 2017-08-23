"use strict";

const MathUtils = {
	randFloatBetween: ( min, max ) => {
		return parseFloat( ( Math.random() * ( max - min ) + min ).toFixed( 4 ) );
	},
	boxContainsPoint: ( pointVec3, width, height, depth, positionVec3 ) => {

		return pointVec3.x < positionVec3.x || pointVec3.x > positionVec3.x + width ||
			pointVec3.y < positionVec3.y || pointVec3.y > positionVec3.y + height ||
			pointVec3.z < positionVec3.z || pointVec3.z > positionVec3.z + depth ? false : true
		;
	},
	pointHasXIntersection: ( pointVec3, lineLength, linePosX ) => {

		return pointVec3.x > linePosX && pointVec3.x < linePosX + lineLength;
	},
	pointHasYIntersection: ( pointVec3, lineLength, linePosY ) => {

		return pointVec3.y > linePosY && pointVec3.y < linePosY + lineLength;
	},
	pointHasZIntersection: ( pointVec3, lineLength, linePosZ ) => {

		return pointVec3.z > linePosZ && pointVec3.z < linePosZ + lineLength;
	}
};

module.exports = MathUtils;