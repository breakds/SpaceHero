var ResourceManager = function() {
    this.resource = new Object();
    this.reverseIndex = new Array();
    this.addImage = function( src, id ) {
	this.reverseIndex.push( id );
	this.resource[id] = new Image();
	this.resource[id].src = src;
	this.resource[id].ready = false;
	this.resource[id].onload = function() {
	    this.ready = true;
	}
	
    }
    this.getResource = function( id ) {
	return this.resource[id];
    }
}
var resources = new ResourceManager();

