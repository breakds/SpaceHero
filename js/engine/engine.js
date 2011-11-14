/***
   This is supposed to be a singleton class
   Do not create duplicated instance.
***/

var Game = function() {
    this.status = "pause";
    this.timer = null;
    this.stage = null;
    this.setStage = function( s ) {
	this.stage = s;
    }
    this.proceed = function() {
	c2d.clearRect( 0, 0, display2d.width, display2d.height );
	dispatcher.check();
	objectManager.updateAll();
	this.stage.drawAll();
    }
    this.pause = function() {
	if ( "playing" == this.status ) {
	    this.status = "pause";
	    clearInterval( this.timer );
	}
    }
    this.play = function() {
	if ( "playing" != this.status ) {
	    this.status = "playing";
	    var self = this;
	    this.timer = setInterval( function() { self.proceed(); }, 30 );
	}
    }
}
var game = new Game();