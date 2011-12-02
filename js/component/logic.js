var GameStatus = function() {
    this.onSelect = null;
}


/*
 * Logic Singleton
 */
var Logic = function() {
    dispatcher.addListener( "SelectCommander", this );
    this.status = new GameStatus();

    this.getStatus = function() {
	return this.status;
    }

    this.onSelectCommander = function( e ) {
	this.status.onSelect = e.obj;
    }
}
Logic.prototype = new GameObject;
logic = new Logic();