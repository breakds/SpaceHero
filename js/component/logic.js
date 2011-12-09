var GameStatus = function() {
    this.onSelect = null;
    this.showArrows = false;
    this.block = false;
    this.commanderMenu = null;
    this.turn = 1;
    this.month = 1;
    this.year = 3000;
    this.nextTurn = function() {
	this.turn++;
	this.month++;
	if( 13 == this.month) {
	    this.month = 1;
	    this.year++;
	}
    }
    this.onTurn = forces[0];
}

var BattleStatus = function() {
    this.commander0 = null;
    this.commander1 = null;
}




/*
 * Logic Singleton
 */
var Logic = function() {
    this.status = new GameStatus();
    this.battle = new BattleStatus();


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
	if ( (!this.status.block) && (!univMap.veil[e.target.u][e.target.v]) ) {
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
	new CommanderMoveAnimation( this.status.onSelect );
    }
    

    dispatcher.addListener( "EndTurn", this );
    this.onEndTurn = function( e ) {
	if ( e.groupID + 1 < forces.length ) {
	    this.status.onTurn = e.groupID + 1;
	    if ( "AI" == forces[e.groupID+1].type ) {
		forces[e.groupID+1].go();
	    }
	} else {
	    this.status.nextTurn();
	    this.status.onTurn = 0;
	    this.requestUpdate();
	    dispatcher.broadcast( { name:"NewTurn" } );
	}
    }

    dispatcher.addListener( "StartBattle", this );
    this.onStartBattle = function( e ) {
	game.setStage( battlefield );
	this.battle.commander0 = e.commander0;
	this.battle.commander1 = e.commander1;
    }
}
Logic.prototype = new GameObject;




