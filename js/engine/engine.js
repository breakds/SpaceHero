/***
    This is supposed to be a singleton class
    Do not create duplicated instance.
***/

var fps = 100;

var Game = function() {
    this.status = "pause";
    this.timer = null;
    this.stage = null;
    this.setStage = function( s )
    {
	if ( this.stage )
	{
	    this.stage.clear();
	}
	this.stage = s;
    }
    this.proceed = function()
    {
	this.stage.resetUpdated();
	dispatcher.check();
	objectManager.updateAll();
	this.stage.drawAll();
    }
    this.pause = function()
    {
	if ( "playing" == this.status )
	{
	    this.status = "pause";
	    clearInterval( this.timer );
	}
    }
    this.play = function()
    {
	if ( "playing" != this.status )
	{
	    this.status = "playing";
	    var self = this;
	    this.timer = setInterval( function() { self.proceed(); }, 1000/fps );
	}
    }
}
var game = new Game();
