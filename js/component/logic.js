var GameStatus = function() {
    this.onSelect = null;
    this.showArrows = false;
    this.arrowPath = null;
}


/*
 * Logic Singleton
 */
var Logic = function() {

    this.status = new GameStatus();

    this.getStatus = function() {
	return this.status;
    }


    dispatcher.addListener( "SelectCommander", this );
    this.onSelectCommander = function( e ) {
	this.status.onSelect = e.obj;
    }

    dispatcher.addListener( "RequestArrowPath", this );
    this.onRequestArrowPath = function( e ) {
	this.status.arrowPath = univMap.floodFill( e.obj.u, e.obj.v, e.target.u, e.target.v );
	this.status.showArrows = true;
    }
}
Logic.prototype = new GameObject;




