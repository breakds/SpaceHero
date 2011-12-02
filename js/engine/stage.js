var Stage = function()
{
    this.viewObjs = new Array();
    this.contexts = new Array();
    this.enable3D = false;
    this.addContext = function( ctx ) {
	this.contexts.push( ctx );
    }
    this.clear = function()
	{
		if ( this.enable3D )
		{
			gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
			mat4.identity(mvMatrix);
			setShader(lightShaderProgram);
			gl.useProgram(currentShader);
		}
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
    }
    this.drawAll = function()
	{
		this.clear();
		for ( idx in this.viewObjs )
		{
			if ( this.viewObjs[idx].visible )
			{
				this.viewObjs[idx].draw();
			}
		}
    }
    this.remove = function( view )
	{
		this.viewObjs.splice( this.viewObjs.indexOf(obj), 1 );
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
