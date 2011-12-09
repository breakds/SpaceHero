var BattleHexagonView = function( m, radius ) {
    this.setModel( m );
    this.register( battlefield );
    this.radius = radius;

    /*
    this.sx = -6.0;
    this.sy = -2.7;
    */
    this.sx = -3.0;
    this.sy = -3.0;
    
    

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
	    vertices.push( -10 );
	}
	var vertexBuffer = gl.createBuffer();
	vertexBuffer.itemSize = 3;
	vertexBuffer.numItems = 6;
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );
	this.hexagonVertexBuffers.push( vertexBuffer );
    }

    /*
    this.initHexagons = function() {

	
    }
    */
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
    this.unitModel.setPosition( 0.0, 0.0, -5 );
    this.unitModel.setScale( .01, .01, .01 );
    this.unitModel.setRotation( 90, 0.0, 0.0 );
    this.draw = function() {
	this.unitModel.draw();
    }
}
BattleUnitView.prototype = new View;
