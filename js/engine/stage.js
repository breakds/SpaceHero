var Stage = function() {
    this.viewObjs = new Array();
    this.drawAll = function() {
	for ( idx in this.viewObjs ) {
	    if ( this.viewObjs[idx].visible ) {
		this.viewObjs[idx].draw();
	    }
	}
    }
    this.remove = function( view ) {
	this.viewObjs.splice( this.viewObjs.indexOf(obj), 1 );
    }
}
