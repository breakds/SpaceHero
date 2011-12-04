var Stage = function()
{
    this.viewObjs = new Array();
    this.contexts = new Array();
    this.enable3D = false;
    this.addContext = function( ctx ) {
	this.contexts.push( ctx );
    }
    this.resetUpdated = function() {
	for ( idx in this.contexts ) {
	    this.contexts[idx].updated = false;
	}
    }
    this.clear = function()
    {
	if ( this.enable3D )
	{
	    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	    var camTranslate = vec3.create();
	    vec3.negate(cam.position, camTranslate);
	    mat4.identity(mvMatrix);
	    var quatMat = mat4.create();
	    quat4.toMat4(cam.orientation, quatMat);
	    mat4.multiply(mvMatrix, quatMat);
	    mat4.translate(mvMatrix, camTranslate);
	    setShader(lightShaderProgram);
	    gl.useProgram(currentShader);
	}
	/*
	for ( idx in this.contexts )
	{
	    if(this.contexts[idx].fillColor)
	    {
		this.contexts[idx].fillStyle=this.contexts[idx].fillColor;
		this.contexts[idx].fillRect( 0, 0, GameScreen.width, GameScreen.height );
	    }
	    else
	    {
		this.contexts[idx].clearRect( 0, 0, GameScreen.width, GameScreen.height );
	    }
	}
	*/
    }
    this.drawAll = function()
    {
	this.clear();
	if(this.enable3D)
	{
	    cam.update();
	}
	/*
	for ( idx in this.viewObjs )
	{
	    if ( this.viewObjs[idx].visible )
	    {
		this.viewObjs[idx].draw();
	    }
	}
	*/
    }

    
    dispatcher.addListener( "UpdateContext", this );
    this.onUpdateContext = function(e) {
	if ( game.stage == this ) {
	    var ctx = this.contexts[this.contexts.indexOf( e.ctx )];
	    if ( ctx.updated ) return;
	    if ( ctx.fillColor ) {
		ctx.fillStyle = ctx.fillColor;
		ctx.fillRect( 0, 0, GameScreen.width, GameScreen.height );
	    } else {
		ctx.clearRect( 0, 0, GameScreen.width, GameScreen.height );
	    }
	    for ( var idx in this.viewObjs ) {
		if ( this.viewObjs[idx].visible ) {
		    this.viewObjs[idx].draw( ctx );
		}
	    }
	    ctx.updated = true;
	}
    }

    this.remove = function( view )
    {
	this.viewObjs.splice( this.viewObjs.indexOf(view), 1 );
    }


    dispatcher.addListener( "LeftMouseDown", this );
    this.onLeftMouseDown = function( e ) {
	if ( this == game.stage ) {
	    for ( idx in this.viewObjs ) {
		if ( this.viewObjs[idx].hitTest( e.x, e.y ) ) {
		    this.viewObjs[idx].onLeftMouseDown.apply( this.viewObjs[idx], [e.x, e.y] );
		}
	    }
	}
    }

    dispatcher.addListener( "LeftMouseUp", this );
    this.onLeftMouseUp = function( e ) {
	if ( this == game.stage ) {
	    for ( idx in this.viewObjs ) {
		if ( this.viewObjs[idx].hitTest( e.x, e.y ) ) {
		    this.viewObjs[idx].onLeftMouseUp.apply( this.viewObjs[idx], [e.x, e.y] );
		}
	    }
	}
    }

    dispatcher.addListener( "RightMouseDown", this );
    this.onRightMouseDown = function( e ) {
	if ( this == game.stage ) {
	    for ( idx in this.viewObjs ) {
		if ( this.viewObjs[idx].hitTest( e.x, e.y ) ) {
		    this.viewObjs[idx].onRightMouseDown.apply( this.viewObjs[idx], [e.x, e.y] );
		}
	    }
	}
    }

    dispatcher.addListener( "RightMouseUp", this );
    this.onRightMouseUp = function( e ) {
	if ( this == game.stage ) {
	    for ( idx in this.viewObjs ) {
		if ( this.viewObjs[idx].hitTest( e.x, e.y ) ) {
		    this.viewObjs[idx].onRightMouseUp.apply( this.viewObjs[idx], [e.x, e.y] );
		}
	    }
	}
    }

    dispatcher.addListener( "MouseMove", this );
    this.onMouseMove = function( e ) {
	if ( this == game.stage ) {
	    for ( idx in this.viewObjs ) {
		if ( this.viewObjs[idx].hitTest( e.x, e.y ) ) {
		    this.viewObjs[idx].onMouseMove.apply( this.viewObjs[idx], [e.x, e.y] );
		}
	    }
	}
    }
    
    dispatcher.addListener( "KeyDown", this );
    this.onKeyDown = function( e ) {
	if ( this == game.stage ) {
	    for ( idx in this.viewObjs ) {
		this.viewObjs[idx].onKeyDown.apply( this.viewObjs[idx], [e.key] );
	    }
	}
    }

    dispatcher.addListener( "KeyUp", this );
    this.onKeyUp = function( e ) {
	if ( this == game.stage ) {
	    for ( idx in this.viewObjs ) {
		this.viewObjs[idx].onKeyUp.apply( this.viewObjs[idx], [e.key] );
	    }
	}
    }
}
