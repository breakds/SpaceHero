var Tween = function() {
    this.tick = 0;
    this.lifetime = 0;
    this.objs = new Array();
    this.onStart = function() {
	return;
    }
    this.next = function() {
	return;
    }
    this.onTerminate = function() {
	return;
    }
    this.update = function() {
	if ( this.tick == 0 ) {
	    this.onStart();
	}
	this.tick++;
	if ( this.tick > this.lifetime ) {
	    this.onTerminate();
	    this.removeInstance();
	} else {
	    this.next();
	}
    }
}
Tween.prototype = new GameObject;
