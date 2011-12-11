var Button = function( caption, bgColor, left, top, width, height, stage, ctx ) {
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.stage = stage;
    this.caption = caption;
    new ButtonView( this, stage, ctx, bgColor );
    this.requestUpdate();

    /// virtual method
    this.onRelease = function() {
	return ;
    }
}
Button.prototype = new GameObject;

var ButtonView = function( button, stage, ctx, bgColor ) {
    this.setModel( button );
    this.register( stage );
    this.ctx = ctx;
    this.bgColor = bgColor;
    this.pressed = false;
    this.highlighted = false;
    
    this.draw = function( ctx ) {
	if ( ctx == this.ctx ) {
	    ctx.lineWidth = 3;
	    if ( this.highlighted ) {
		ctx.strokeStyle = "#FFFFFF";
	    } else {
		ctx.strokeStyle = "#888888";
	    }

	    ctx.fillStyle = this.bgColor;
	    ctx.roundRect( this.model.left,
			   this.model.top,
			   this.model.width,
			   this.model.height,
			   5, true, true
			 );
	    
	    
	    if ( this.highlighted ) {
		ctxMenu.fillStyle = "#FF0000";
	    } else {
		ctxMenu.fillStyle = "#FFFFFF";
	    }
	    ctxMenu.font = "12px Arial";
	    ctxMenu.textAlign = "center";
	    ctxMenu.textBaseline = "middle";
	    ctxMenu.fillText( this.model.caption,
			      this.model.left + this.model.width * 0.5,
			      this.model.top + this.model.height * 0.5 );
	}
    }

    this.onMouseMove = function( x, y ) {
	this.highlighted = true;
	this.requestUpdate();
    }
    this.onRollOut = function( x, y ) {
	this.highlighted = false;
	this.requestUpdate();
    }
    this.onLeftMouseDown = function( x, y ) {
	this.pressed = true;
    }

    this.onLeftMouseUp = function( x, y ) {
	if ( this.pressed ) {
	    this.pressed = false;
	    this.model.onRelease();
	}
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: this.ctx } );
    }
    this.hitTest = function( x, y ) {
	if ( x < this.model.left ||
	     x > this.model.left + this.model.width ||
	     y < this.model.top ||
	     y > this.model.top + this.model.height ) {
	    return false;
	}
	return true;
    }
}
ButtonView.prototype = new View;
