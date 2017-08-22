"use strict";

const MathUtils = {
	randFloatBetween: ( min, max ) => {
		return parseFloat( ( Math.random() * ( max - min ) + min ).toFixed( 4 ) );
	}
};

module.exports = MathUtils;