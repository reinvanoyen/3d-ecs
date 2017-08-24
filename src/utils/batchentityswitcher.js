"use strict";

class BatchEntitySwitcher {

	constructor( ecs ) {

		this.ecs = ecs;
		this.batches = {};
		this.activeSceneId = null;
		this.activeEntities = [];
	}

	addBatch( id, entities ) {

		this.batches[ id ] = entities;
	}

	setBatch( id ) {

		if( id != this.activeBatchId && this.batches[ id ] ) {

			this.activeBatchId = id;

			// Remove current entities
			this.activeEntities.forEach( e => {

				this.ecs.removeEntity( e );
			} );

			// Add new entities
			this.batches[ id ].forEach( e => {

				this.ecs.addEntity( e );
			} );
		}
	}
}

module.exports = BatchEntitySwitcher;