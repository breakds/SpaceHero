/***
   This is supposed to be a singleton class
   Do not create duplicated instance.
***/

var fps = 60;

var Game = function() {
    this.status = "pause";
    this.timer = null;
    this.stage = null;
    this.setStage = function( s ) {
	this.stage = s;
    }
    this.proceed = function() {
		c2d.clearRect( 0, 0, display2d.width, display2d.height );
		
		
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
        mat4.identity(mvMatrix);
        setShader(lightShaderProgram);
		gl.useProgram(currentShader);
		
		
		dispatcher.check();
		objectManager.updateAll();
		this.stage.drawAll();
    }
    this.pause = function() {
		if ( "playing" == this.status ) {
			this.status = "pause";
			clearInterval( this.timer );
		}
    }
    this.play = function() {
	if ( "playing" != this.status ) {
	    this.status = "playing";
	    var self = this;
	    this.timer = setInterval( function() { self.proceed(); }, 1000/fps );
	}
    }
}
var game = new Game();