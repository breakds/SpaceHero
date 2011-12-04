var GameStatus = function() {
    this.onSelect = null;
    this.showArrows = false;
    this.arrowPath = null;
    this.block = false;
    this.target = { u:-1, v:-1 };
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

    this.spliceArrow = function() {
	if ( this.status.arrowPath.length > 0 ) {
	    this.status.arrowPath.splice(0,1);
	    this.requestUpdate();
	}
    }


    dispatcher.addListener( "SelectCommander", this );
    this.onSelectCommander = function( e ) {
	if ( !this.status.block ) {
	    if ( this.status.onSelect != e.obj ) {
		if ( this.status.onSelect != null ) {
		    this.status.onSelect.removeView( this.status.commanderMenu );
		    this.status.commanderMenu = null;
		}
		this.status.onSelect = e.obj;
		this.status.commanderMenu = new CommanderMenu( e.obj, 
							       GameScreen.width,
							       300 );
	    }
	}
    }

    dispatcher.addListener( "RequestArrowPath", this );
    this.onRequestArrowPath = function( e ) {
	if ( !this.status.block ) {
	    this.status.arrowPath = univMap.floodFill( e.obj.u, e.obj.v, e.target.u, e.target.v );
	    this.status.target.u = e.target.u;
	    this.status.target.v = e.target.v;
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
	var tween = new CommanderMoveAnimation( this.status.onSelect, 
						this.status.arrowPath.length );
    }
    
}
Logic.prototype = new GameObject;




