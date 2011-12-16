var MovieClipView = function( mc, st, ctx ) {
    this.setModel( mc );
    this.register( st );
    this.ctx = ctx;
    this.draw = function( ctx ) {
	if ( ctx == this.ctx ) {
	    drawRotatedImage2( this.ctx,
			       resources.getResource( 
				   this.model.itemName +
				       this.model.frame + "Anim" ),
			       this.model.rotation,
			       this.model.x,
			       this.model.y,
			       this.model.width * this.model.scale,
			       this.model.height * this.model.scale,
			       this.model.center.x * this.model.scale,
			       this.model.center.y * this.model.scale );
	}
    }

    
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: this.ctx } );	
    }
}
MovieClipView.prototype = new View;


var MovieClip = function( itemName, width, height, frameNum, st, ctx ) {
    this.views = new Array();
    new MovieClipView( this, st, ctx );
    this.frame = 0;
    this.frameNum = frameNum;
    this.tick = 0;
    this.itemName = itemName;
    this.onPlay = true;
    this.width = width;
    this.height = height;
    
    this.x = 0;
    this.y = 0;
    this.setPos = function( x, y ) {
	this.x = x;
	this.y = y;
	this.requestUpdate();
    }
    
    this.center = { x:0, y:0 }
    this.setCenter = function( x, y ) {
	this.center.x = x;
	this.center.y = y;
	this.requestUpdate();
    }

    this.scale = 1.0;
    this.setScale = function( scl ) {
	this.scale = scl;
	this.requestUpdate();
    }
    
    this.rotation = 0;
    this.setRotation = function( rot ) {
	this.rotation = rot;
    }
    
    this.intv = 5;
    this.setIntv = function( i ) {
	this.intv = i;
    }

    this.stop = function() {
	this.onPlay = false;
    }
    
    this.nextFrame = function() {
	this.frame++;
	if ( this.frame >= this.frameNum ) {
	    this.frame = 0;
	}
	this.requestUpdate();	
    }

    this.update = function() {
	if ( this.onPlay ) {
	    this.tick++;
	    if ( this.tick >= this.intv ) {
		this.tick = 0;
		this.nextFrame();
	    }
	}
    }
    this.init();
}
MovieClip.prototype = new GameObject;


