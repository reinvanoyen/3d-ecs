"use strict";

const MathUtils = {
	randFloatBetween: (min, max) => {
		return ( Math.random() * ( max - min ) + min ).toFixed( 4 );
	}
};

module.exports = MathUtils;