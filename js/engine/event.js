/***
    The EventDispatcher is designed to be a singleton class
    Do not make multiple instances.
***/
var EventDispatcher = function() {
    this.eventStack = new Array();
    this.handlers = new Object();
    this.check = function() {
	while ( this.eventStack.length > 0 ) {
	    var event = this.eventStack.pop();
	    if ( this.handlers[event.name] ) {
		for ( idx in this.handlers[event.name] ) {
		    this.handlers[event.name]
		    [idx]["on" + event.name].apply( event );
		}
	    }
	}
    }
    this.addListener = function( eventName, obj ) {
	if ( this.handlers[eventName] ) {
	    this.handlers[eventName].push( obj );
	} else {
	    this.handlers[eventName] = new Array();
	    this.handlers[eventName].push( obj );
	}
    }
    this.removeListener = function( eventName, obj ) {
	if ( this.handlers[eventName] ) {
	    this.handlers[eventName].slice(
		this.handlers[eventName].indexOf( obj ), 1 );
	}
    }
    this.broadcast = function( e ) {
	this.eventStack.push( e );
    }
}
var dispatcher = new EventDispatcher();