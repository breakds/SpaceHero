var HexagonGridView = function( m, height, width, margin )
{
    /// Init:
    this.setModel( m );
    this.register( universe );
    
    this.left = margin;
    this.top = margin;
    var heightAvailable = height - 2.0 * margin;
    var widthAvailable = width - 2.0 * margin;
    var radiusX = widthAvailable / (1.5 * this.model.cols - 1.5);
    var radiusY = heightAvailable / (Math.sqrt(3) * (this.model.rows + 0.5));
    if(radiusX < radiusY)
    {
	this.radius = radiusX;
    }
    else // radiusY < radiusX
    {
	this.radius = radiusY;
    }
    this.boundBox = { xmin: this.left - this.radius,
		      xmax: this.left + this.radius * ( 1.5 * this.model.cols - 0.5 ),
		      ymin: this.top - this.radius * Math.sqrt(3) * 0.5,
		      ymax: this.top + this.radius * Math.sqrt(3) * ( this.model.rows + 1 )
		    };
    
    
    this.drawHexagon = function( x, y )
    {
	var ang = 0.0;
	var step = Math.PI / 3.0;
	ctxBg2d.moveTo(x + this.radius, y);
	for ( var i=0; i<6; i++ )
	{
	    ang += step;
	    ctxBg2d.lineTo( x + this.radius * Math.cos( ang ), y + this.radius * Math.sin( ang ) );
	}
    }

    this.drawHighlightedGrid = function( x, y )
    {
	var ang = 0.0;
	var step = Math.PI / 3.0;
	ctxBg2d.fillStyle = "#00FF00";
	ctxBg2d.beginPath();
	ctxBg2d.moveTo(x + this.radius, y);
	for ( var i=0; i<6; i++ )
	{
	    ang += step;
	    ctxBg2d.lineTo( x + this.radius * Math.cos( ang ), y + this.radius * Math.sin( ang ) );
	}
	ctxBg2d.closePath();
	ctxBg2d.fill();
    }

    this.drawHalfVeiledHexagon = function( x, y, angle ) {
	var ang = 0.0;
	var step = Math.PI / 3.0;
	var r = this.radius;
	var smallerRaidus = this.radius * Math.sqrt(3) * 0.5;
	var dx = 0.5 * ( 1.0- Math.cos(angle) ) * smallerRaidus;
	var dy = Math.sqrt(3) * 0.5 * ( 1.0 - Math.cos(angle) ) * smallerRaidus;
	ctxBg2d.moveTo( x + r - dx , y - dy );
	for ( var i=0; i<6; i++ )
	{
	    ang += step;
	    if ( 0 == i || 5 == i ) {
		ctxBg2d.lineTo( x + r * Math.cos( ang ) - dx, 
				y + r * Math.sin( ang ) - dy );
	    } else if ( 2 == i || 3 == i ) {
		ctxBg2d.lineTo( x + r * Math.cos( ang ) + dx, 
				y + r * Math.sin( ang ) + dy );
	    } else {
		ctxBg2d.lineTo( x + r * Math.cos( ang ), y + r * Math.sin( ang ) );
	    }
	}
    }

    this.highlightCoor = { u: -1, v: -1 };
    
    
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxBg2d } );
    }
    this.requestUpdate();
    
    this.draw = function( ctx )
    {

	if ( ctx == ctxBg2d ) {
	    var x = this.left;
	    var y = this.top;
	    var smallerRadius = this.radius * Math.sqrt(3) * 0.5;
	    
	    ctxBg2d.strokeStyle = "#FFFFFF"
	    ctxBg2d.beginPath();
	    for ( var u=0; u<this.model.cols; u++ ) 
	    {
		y = this.top + this.model.lower[u] * smallerRadius;
		for ( var v=this.model.lower[u]; v<=this.model.upper[u]; v+=2 )
		{
		    this.drawHexagon( x, y );
		    y += smallerRadius * 2;
		}
		x += this.radius * 1.5;
	    }
	    ctxBg2d.closePath();
	    ctxBg2d.stroke();

	    
	    /* 
	     * To Jefferson:
	     * Draw Terran Here
	     * Please be aware that 
	     * if veil[u][v], don't draw terran for (u,v)
	     */
	    

	    /// draw Veils
	    var x = this.left;
	    var y = this.top;
	    ctxBg2d.fillStyle = "rgba(255,255,255,0.4)";
	    ctxBg2d.beginPath();
	    for ( var u=0; u<this.model.cols; u++ ) 
	    {
		y = this.top + this.model.lower[u] * smallerRadius;
		for ( var v=this.model.lower[u]; v<=this.model.upper[u]; v+=2 )
		{
		    if ( this.model.veil[u][v] ) {
			this.drawHexagon( x, y );
		    }
		    y += smallerRadius * 2;
		}
		x += this.radius * 1.5;
	    }
	    ctxBg2d.closePath();
	    ctxBg2d.fill();

	    
	    /// draw Half-Veiled Cells
	    ctxBg2d.fillStyle = "rgba(255,255,255,0.4)";
	    ctxBg2d.beginPath();
	    for ( var i=0; i<this.model.unveilAnimations.length; i++ ) {
		var c = this.getXYFromUV( this.model.unveilAnimations[i].u,
					  this.model.unveilAnimations[i].v );
		this.drawHalfVeiledHexagon( c.x, c.y, this.model.unveilAnimations[i].angle );
	    }
	    ctxBg2d.closePath();
	    ctxBg2d.fill();
	    
	    
	    // draw highlighted cell last
	    if ( this.highlightCoor.u > -1 )
	    {
		this.drawHighlightedGrid( this.left + this.radius * 1.5 * this.highlightCoor.u,
					  this.top + this.highlightCoor.v * smallerRadius );
	    }
	} else {
	    return ;
	}
    }

    this.getUVFromXY = function( x, y )
    {
	var smallerRadius = this.radius * Math.sqrt(3) * 0.5;
	var deltaX = x - this.left;
	var deltaY = y - this.top;
	var v = Math.ceil( deltaY / smallerRadius );
	var u = Math.round( deltaX / (1.5 * this.radius) );
	v -= (( v & 1 ) ^ ( this.model.lower[u] & 1 ) );
	if ( this.model.inMap( u, v ) )
	{
	    return {u:u,v:v};
	}
	else
	{
	    return {u:-1,v:-1};
	}
    }


    this.getXYFromUV = function( u, v ) {
	return  { x: this.radius * 1.5 * u + this.left, 
		  y: this.radius * Math.sqrt(3) * 0.5 * v + this.top };
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
	var uv = this.getUVFromXY( x, y );
	if ( uv.u != -1 && ( uv.u != this.highlightCoor.u ||
			     uv.v != this.highlightCoor.v ) ) {
	    this.highlightCoor.u = uv.u;
	    this.highlightCoor.v = uv.v;
	    this.requestUpdate();
	}
    }
    this.onLeftMouseDown = function( x, y ) {
	var uv = this.getUVFromXY( x, y );
	var obj = this.model.getMap( uv.u, uv.v );
	var status = logic.getStatus();
	if ( obj.type == "Commander" ) {
	    dispatcher.broadcast( { name: "SelectCommander",
				    obj: obj } );
	} else if ( status.onSelect != null ) {
	    obj = status.onSelect;
	    if ( "Commander" == obj.type && 0 == obj.group ) {
		if ( uv.u == status.onSelect.target.u && 
		     uv.v == status.onSelect.target.v ) {
		    dispatcher.broadcast( { name: "CommanderMove" } );
		} else {
		    if ( this.model.inMap( uv.u, uv.v ) ) {
			dispatcher.broadcast( { name: "RequestArrowPath", 
						obj: obj,
						target: uv } );
		    }
		}
	    }
	}
    }
}
HexagonGridView.prototype = new View();




var CommanderUniverseView = function( commander ) {
    this.setModel( commander );
    this.register( universe );
    
    this.draw = function( ctx ) {
	if ( ctx == ctx2d[0] ) {
	    c = univMapView.getXYFromUV( this.model.u, this.model.v );
	    var size = univMapView.radius * 1.90;
	    if ( this.model == logic.status.onSelect ) {
		drawRotatedImage( ctx2d[0],
				  resources.getResource( "commanderSelectImg" ),
				  Math.PI * 2 / 6 * this.model.orientation,
				  c.x,
				  c.y,
				  size,
				  size,
				  true );
	    } else {
		drawRotatedImage( ctx2d[0],
				  resources.getResource( "commanderImg" ),
				  Math.PI * 2 / 6 * this.model.orientation,
				  c.x,
				  c.y,
				  size,
				  size,
				  true );
	    }
	}
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctx2d[0] } );
    }
}
CommanderUniverseView.prototype = new View;


var CommanderMoveAnimation = function( commanderObj ) {
    this.objs = new Array();
    this.objs.push( commanderObj );
    this.lifetime = commanderObj.path.length * 5;
    this.onStart = function() {
	dispatcher.broadcast( "BlockAll" );
    }
    this.onTerminate = function() {
	dispatcher.broadcast( "UnblockAll" );
    }
    this.next = function() {
	if ( 0 == this.tick % 5 ) {
	    this.objs[0].setPos( this.objs[0].u + univMap.du[this.objs[0].path[0]],
				 this.objs[0].v + univMap.dv[this.objs[0].path[0]] );
	    this.objs[0].setOrientation( this.objs[0].path[0] );
	    this.objs[0].path.splice(0,1);
	    logic.requestUpdate();
	}
    }
    this.init();
}
CommanderMoveAnimation.prototype = new Tween;


/*
 * LogicView Singleton : Including Menu
 */

var UniverseLogicView = function( logicModel ) {
    this.setModel( logicModel );
    this.register( universe );
    this.drawArrows = function() {
	var status = this.model.getStatus();
	if ( status.onSelect != null ) {
	    var obj = status.onSelect;

	    if ( obj.type == "Commander" && 0 == obj.group ) {
		if ( obj.path != null && status.showArrows) {
		    var u = obj.u;
		    var v = obj.v;
		    var size = univMapView.radius * 1.40;
		    for ( var i=0; i<obj.path.length; i++ ) {
			u += univMap.du[obj.path[i]];
			v += univMap.dv[obj.path[i]];
			var c = univMapView.getXYFromUV( u, v );
			if ( i != obj.path.length-1 ) {
			    drawRotatedImage( ctx2d[1],
					      resources.getResource( "greenArrowImg" ),
					      Math.PI * 2 / 6 * obj.path[i+1],
					      c.x,
					      c.y,
					      size,
					      size,
					      true );
			} else {
			    drawRotatedImage( ctx2d[1],
					      resources.getResource( "targetImg" ),
					      0,
					      c.x,
					      c.y,
					      size,
					      size,
					      true );
			}
		    }
		}
	    }
	}
    }
    this.draw = function( ctx ) {
	if ( ctx == ctx2d[1] ) {
	    this.drawArrows();
	}
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctx2d[1] } );
    }
}
UniverseLogicView.prototype = new View;




