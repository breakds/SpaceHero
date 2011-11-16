var GameObject = function() {
    this.views = new Array();
    this.init = function() {
		objectManager.objects.push( this );
    }
    this.addView = function( viewObj ) {
		this.views.push( viewObj );
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
}



/***
    This is supposed to be a singleton class
    Do not create multiple instance
***/
var ObjectManager = function() {
    this.objects = new Array();
    this.updateAll = function() {
		for ( idx in this.objects ) {
	//	    trace( "Updating "+this.objects[idx] );
			this.objects[idx].update();
		}
    }
    this.remove = function( obj ) {
		this.objects.splice( this.objects.indexOf(obj), 1 );
	}
	this.reset = function() {
		this.objects = new Array();
    }
}
var  objectManager = new ObjectManager();