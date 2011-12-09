var BattleHexagonView = function( m, height, width, margin ) {
    this.setModel( m );
    this.register( battlefield );

    this.left = margin;
    this.top = margin;
    
    


    /*
    this.drawHexagon = function( x, y ) {
	var r = 2.0;
	var ang = 0.0;
	var step = Math.PI / 3.0;
	

	
	var vertices = gl.createBuffer();



	var vertices = new Array();
	vertices.push( x + r );
	vertices.push( y );
	vertices.push( 0 );
	for ( var i=0; i<5; i++ )
	{
	    ang += step;
	    vertices.push( x + r * Math.cos( ang ) );
	    vertices.push( y + r * Math.sin( ang ) );
	    vertices.push( 0 );
	}

	
	var colors = new Array();
	for ( var i=0; i<24; i++ ) {
	    colors.push(1.0);
	}


	var vertexBuffer = gl.createBuffer();
	vertexBuffer.itemSize = 3;
	vertexBuffer.numItems = 6;
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );
	gl.vertexAttribPointer( notShaderProgram.vertexPositionAttribute,
				vertexBuffer.itemSize,
				gl.FLOAT,
				false,
				0, 0 );
	
	
	var colorBuffer = gl.createBuffer();
	colorBuffer.itemSize = 4;
	colorBuffer.numItems = 6;
	gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW );
	gl.vertexAttribPointer( notShaderProgram.vertexColorAttribute,
				colorBuffer.itemSize,
				gl.FLOAT,
				false,
				0, 0 );



	setMatrixUniforms( notShaderProgram );
	
	
	gl.drawArrays( gl.LINE_LOOP, 0, vertexBuffer.numItems );
    }
    this.draw = function() {
	setShader( notShaderProgram );
	cam.position[0] = 0;
	cam.position[1] = -43;
	cam.position[2] = 5;
	
	this.drawHexagon( 0.0, 0.0 );
	setShader( lightShaderProgram );
    }
    */
    
    
    var resolution = 100.0;
    
    var vertices = new Array();
    var colors = new Array();
    
    for(var i = 0.0; i < resolution; i++)
    {
	vertices.push(10 * Math.sin(2.0 * Math.PI * i / resolution));
	vertices.push(10 * Math.cos(2.0 * Math.PI * i / resolution));
	vertices.push(0.0);
	colors.push(1.0);
	colors.push(1.0);
	colors.push(1.0);
	colors.push(0.5);
    }
    
    this.circleVertexBuffer = gl.createBuffer();
    this.circleColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.circleVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.circleColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    this.circleVertexBuffer.itemSize = 3;
    this.circleVertexBuffer.numItems = resolution;
    this.circleColorBuffer.itemSize = 4;
    this.circleColorBuffer.numItems = resolution;
    
    this.draw = function()
    {
	setShader(notShaderProgram);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.circleVertexBuffer);
	gl.vertexAttribPointer(notShaderProgram.vertexPositionAttribute, this.circleVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.circleColorBuffer);
	gl.vertexAttribPointer(notShaderProgram.vertexColorAttribute, this.circleColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	setMatrixUniforms(notShaderProgram);
	gl.drawArrays(gl.LINE_LOOP, 0, this.circleVertexBuffer.numItems);
	setShader(lightShaderProgram);
    }
    
}

BattleHexagonView.prototype = new View;
