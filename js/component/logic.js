var GameStatus = function() {
    this.onSelect = null;
    this.showArrows = false;
    this.block = false;
    this.commanderMenu = null;
}


/*
 * Logic Singleton
 */
var Logic = function() {

    this.status = new GameStatus();

    this.getStatus = function() {
	return this.status;
    }
    
    dispatcher.addListener( "SelectCommander", this );
    this.onSelectCommander = function( e ) {
	if ( !this.status.block ) {
	    if ( this.status.onSelect != e.obj ) {
		if ( this.status.onSelect != null ) {
		    this.status.onSelect.removeView( this.status.commanderMenu );
		    this.status.commanderMenu = null;
		    this.status.onSelect.requestUpdate();
		}
		this.status.onSelect = e.obj;
		this.status.commanderMenu = new CommanderMenu( e.obj, 
							       GameScreen.width,
							       300 );
		e.obj.updatePath();
		e.obj.requestUpdate();
		this.requestUpdate();
	    }
	}
    }

    dispatcher.addListener( "RequestArrowPath", this );
    this.onRequestArrowPath = function( e ) {
	if ( !this.status.block ) {
	    this.status.onSelect.target.u = e.target.u;
	    this.status.onSelect.target.v = e.target.v;
	    this.status.onSelect.updatePath();
	    this.status.showArrows = true;
	    this.requestUpdate();
	}
    }
    
    dispatcher.addListener( "BlockAll", this );
    this.onBlockAll = function( e ) {
	this.status.block = true;
    }

    dispatcher.addListener( "UnblockAll", this );
    this.onUnblockAll = function( e ) {
	this.status.block = false;
    }

    dispatcher.addListener( "CommanderMove", this );
    this.onCommanderMove = function( e ) {
	var tween = new CommanderMoveAnimation( this.status.onSelect );
    }
    
}
Logic.prototype = new GameObject;




