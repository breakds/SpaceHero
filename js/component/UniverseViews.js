var HexagonGridView = function( m, top, left, radius ) {
    /// Init:
    this.setModel( m );
    this.register( universe );
    

    this.top = top;
    this.left = left;
    this.radius = radius;
    this.boundBox = { xmin: this.left - this.radius,
		      xmax: this.left + this.radius * ( 1.5 * this.model.cols - 0.5 ),
		      ymin: this.top - this.radius * Math.sqrt(3) * 0.5,
		      ymax: this.top + this.radius * Math.sqrt(3) * ( this.model.rows + 1 )
		    };
    
    
    this.drawHexagonGrid = function( x, y ) {
	var ang = 0.0;
	var step = Math.PI / 3.0;
	ctxBg2d.moveTo( x + this.radius, y );
	for ( var i=0; i<6; i++ ) {
	    ang += step;
	    ctxBg2d.lineTo( x + this.radius * Math.cos( ang ),
			    y + this.radius * Math.sin( ang ) );
	}
    }

    this.drawHighlightedGrid = function( x, y ) {
	var ang = 0.0;
	var step = Math.PI / 3.0;
	ctxBg2d.fillStyle = "#0055AA";
	ctxBg2d.beginPath();
	ctxBg2d.moveTo( x + this.radius, y );
	for ( var i=0; i<6; i++ ) {
	    ang += step;
	    ctxBg2d.lineTo( x + this.radius * Math.cos( ang ),
			    y + this.radius * Math.sin( ang ) );
	}
	ctxBg2d.closePath();
	ctxBg2d.fill();
    }

    this.highlightCoor = { u: -1, v: -1 };
    

    
    this.draw = function() {
	var x = this.left;
	var y = this.top;
	var smallerRadius = this.radius * Math.sqrt(3) * 0.5;

	ctxBg2d.strokeStyle = "#000000"
	ctxBg2d.beginPath();
	for ( var u=0; u<this.model.cols; u++ ) {
	    y = this.left + this.model.lower[u] * smallerRadius;
	    for ( var v=this.model.lower[u]; v<=this.model.upper[u]; v+=2 ) {
		this.drawHexagonGrid( x, y );
		y += smallerRadius * 2;
	    }
	    x += this.radius * 1.5;
	}
	ctxBg2d.closePath();
	ctxBg2d.stroke();
	
	/// Highlighted ?
	if ( this.highlightCoor.u > -1 ) {
	    this.drawHighlightedGrid( this.left + this.radius * 1.5 * this.highlightCoor.u,
				      this.top + this.highlightCoor.v * smallerRadius );
	}
    }



    this.getUVFromXY = function( x, y ) {
	var smallerRadius = this.radius * Math.sqrt(3) * 0.5;
	var deltaX = x - this.left;
	var deltaY = y - this.top;
	var v = Math.ceil( deltaY / smallerRadius );
	var u = Math.round( deltaX / (1.5 * this.radius) );
	v -= (( v & 1 ) ^ ( this.model.lower[u] & 1 ) );
	if ( this.model.inMap( u, v ) ) {
	    return {u:u,v:v};
	} else {
	    return {u:-1,v:-1};
	}
    }


    this.getXYFromUV = function( u, v ) {
	return  { x: this.radius * 1.5 * u + this.left, 
		  y: this.radius * Math.sqrt(3) * ( v - 0.5 ) + this.top };
    }

    /// Implement mouse related functions
    this.hitTest = function( x, y ) {
	if ( x < this.boundBox.xmin ||
	     x > this.boundBox.xmax ||
	     y < this.boundBox.ymin ||
	     y > this.boundBox.ymax ) {
	    return false;
	}
	return true;
    }
    this.onMouseMove = function( x, y ) {
	uv = this.getUVFromXY( x, y );
	this.highlightCoor.u = uv.u;
	this.highlightCoor.v = uv.v;
    }
}
HexagonGridView.prototype = new View();




var CommanderUniverseView = function( commander ) {
    this.setModel( commander );
    this.register( universe );
    
    this.draw = function() {
	c = univMapView.getXYFromUV( this.model.u, this.model.v );
	ctxBg2d.drawImage( resources.getResource( "commanderImg" ), 
			   c.x, c.y, 50, 50 );
    }
}
CommanderUniverseView.prototype = new View;
