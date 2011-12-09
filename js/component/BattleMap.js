var BattleHexagonView = function( m, radius ) {
    this.setModel( m );
    this.register( battlefield );
    
    
    /*
     * In this view, the map is rotated 90 degree, so cols will serve 
     * as rows, and the same goes for rows
     */
    
    this.left = 100;
    this.top = 250;
    
    this.radius = radius;
    
    
    this.drawHexagon = function( x, y )
    {
	var ang = -Math.PI * 0.5;
	var step = Math.PI / 3.0;
	ctxBg2d.moveTo(x, y - this.radius);
	for ( var i=0; i<6; i++ )
	{
	    ang += step;
	    ctxBg2d.lineTo( x + this.radius * Math.cos( ang ), y + this.radius * Math.sin( ang ) );
	}
    }

    
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxBg2d } );
    }

    this.requestUpdate();

    this.draw = function( ctx ) {
	if ( ctx == ctxBg2d ) {
	    var x = this.left;
	    var y = this.top;
	    var smallerRadius = this.radius * Math.sqrt(3) * 0.5;
	    
	    ctxBg2d.strokeStyle = "#0000FF"
	    ctxBg2d.fillStyle = "#223366";
	    ctxBg2d.beginPath();
	    for ( var u=0; u<this.model.cols; u++ ) 
	    {
		x = this.left + this.model.lower[u] * smallerRadius;
		for ( var v=this.model.lower[u]; v<=this.model.upper[u]; v+=2 )
		{
		    this.drawHexagon( x, y );
		    x += smallerRadius * 2;
		}
		y += this.radius * 1.5;
	    }
	    ctxBg2d.closePath();
	    ctxBg2d.fill();
	    ctxBg2d.stroke();
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
	return  { y: this.radius * 1.5 * u + this.top, 
		  x: this.radius * Math.sqrt(3) * 0.5 * v + this.left };
    }
}
BattleHexagonView.prototype = new View;


var BattleUnitView = function( unit, side ) {
    this.setModel( unit );
    this.register( battlefield );


    this.side = side;
    if ( 0 == this.side ) {
	this.rotation = Math.PI * 0.5;
    } else {
	this.rotation = -Math.PI * 0.5;
    }

    
    this.draw = function( ctx ) {
	if ( ctx == ctx2d[0] ) {
	    c = batMapView.getXYFromUV( this.model.u, this.model.v );
	    var size = batMapView.radius * 1.90;
	    drawRotatedImage( ctx2d[0],
			      this.model.template.image,
			      this.rotation,
			      c.x,
			      c.y,
			      size,
			      size,
			      true );
	}
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctx2d[0] } );
    }
    this.requestUpdate();
}
BattleUnitView.prototype = new View;



/*
var BattleHexagonView = function( m, radius ) {
    this.setModel( m );
    this.register( battlefield );
    this.radius = radius;


    this.sx = -6.0;
    this.sy = -2.7;

    

    this.hexagonVertexBuffers = new Array();


    /// Init ColorBuffer
    var colors = new Array();
    for ( var i=0; i<24; i++ ) {
	colors.push(1.0);
    }
    this.colorBuffer = gl.createBuffer();
    this.colorBuffer.itemSize = 4;
    this.colorBuffer.numItems = 6;
    gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW );

    
    this.addHexagon = function( x, y ) {
	var r = this.radius;
	var ang = 0.0;
	var step = Math.PI / 3.0;
	var vertices = new Array();
	for ( var i=0; i<6; i++ )
	{
	    ang += step;
	    vertices.push( x + r * Math.cos( ang ) );
	    vertices.push( y + r * Math.sin( ang ) );
	    vertices.push( -7 );
	}
	var vertexBuffer = gl.createBuffer();
	vertexBuffer.itemSize = 3;
	vertexBuffer.numItems = 6;
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );
	this.hexagonVertexBuffers.push( vertexBuffer );
    }

    this.initHexagons = function() {
	var x = this.sx;
	var y = this.sy;
	var smallerRadius = this.radius * Math.sqrt(3) * 0.5;
	for ( var u=0; u<this.model.cols; u++ ) {
	    y = this.sy + this.model.lower[u] * smallerRadius;
	    for ( var v=this.model.lower[u]; v<=this.model.upper[u]; v+=2 )
	    {
		this.addHexagon( x, y );
		y += smallerRadius * 2;
	    }
	    x += this.radius * 1.5;
	}

    }
    this.initHexagons();

    
    
    this.draw = function() {
	setShader( notShaderProgram );
	for ( var i=0; i<this.hexagonVertexBuffers.length; i++ ) {
	    gl.bindBuffer( gl.ARRAY_BUFFER, this.hexagonVertexBuffers[i] );
	    gl.vertexAttribPointer( notShaderProgram.vertexPositionAttribute,
				    this.hexagonVertexBuffers[i].itemSize,
				    gl.FLOAT,
				    false,
				    0, 0 );
	    gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuffer );
	    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW );
	    gl.vertexAttribPointer( notShaderProgram.vertexColorAttribute,
				    this.colorBuffer.itemSize,
				    gl.FLOAT,
				    false,
				    0, 0 );
	    setMatrixUniforms( notShaderProgram );
	    gl.drawArrays( gl.LINE_LOOP, 0, this.hexagonVertexBuffers[i].numItems );
	}
	setShader( lightShaderProgram );
    }
}
BattleHexagonView.prototype = new View;


var BattleUnitView = function( unit ) {
    this.setModel( unit );
    this.register( battlefield );


    this.unitModel = new Model( "ship_medium.obj", "default.png" );
    this.unitModel.setPosition( -3.0, 0.0, -6 );
    this.unitModel.setScale( .03, .03, .03 );
    this.unitModel.setRotation( 90, 0.0, 0.0 );
    this.draw = function() {
	this.unitModel.draw();
    }
}
BattleUnitView.prototype = new View;
*/
