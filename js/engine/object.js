var GameObject = function() {
    this.views = new Array();
    this.init = function() {
	objectManager.objects.push( this );
    }
    this.addView = function( viewObj ) {
	this.views.push( viewObj );
    }
    this.removeView = function( viewObj ) {
	this.views.splice( this.views.indexOf(viewObj), 1 );
	viewObj.removeInstance();
    }
    this.removeInstance = function() {
	for ( idx in this.views ) {
	    this.views[idx].removeInstance();
	}
	objectManager.remove( this );
    }
    /// virtual methods:
    this.update = function() {
	return ;
    }
    this.requestUpdate = function() {
	for ( idx in this.views ) {
	    this.views[idx].requestUpdate();
	}
    }
}



/***
    This is supposed to be a singleton class
    Do not create multiple instance
***/
var ObjectManager = function() {
    this.objects = new Array();
    this.updateAll = function() {
	for ( var idx=0; idx<this.objects.length; idx++ ) {
	    this.objects[idx].update();
	}
    }
    this.remove = function( obj ) {
	var idx = this.objects.indexOf(obj);
	if ( idx != -1 ) {
	    this.objects.splice( idx, 1 );
	} else {
	    trace( "wrong!" );
	    trace( obj );
	}
    }
    this.reset = function() {
	this.objects = new Array();
    }
}
var objectManager = new ObjectManager();
