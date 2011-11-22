var Stage = function() {
    this.viewObjs = new Array();
    this.contexts = new Array();
    this.enable3D = false;
    this.addContext = function( ctx ) {
	this.contexts.push( ctx );
    }
    this.clear = function() {
	if ( this.enable3D ) {
	    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
            mat4.identity(mvMatrix);
            setShader(lightShaderProgram);
	    gl.useProgram(currentShader);
	}
	for ( idx in this.contexts ) {
	    this.contexts[idx].clearRect( 0, 0, GameScreen.width, GameScreen.height );
	}
    }
    this.drawAll = function() {
	this.clear();
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
