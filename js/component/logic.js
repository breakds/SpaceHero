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
    this.unitViews = new Array();
    this.units = new Array();
    this.turn = 0;
    this.currentUnitID = 0;
    this.reachable = new Array();
    this.onAnimation = false;
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
	/// Reset the camera
	cam.reset();

	var rotation = quat4.create();
	rotation[0] = 0.0;
	rotation[1] = 0.0;
	rotation[2] = 0.65;
	quat4.calculateW( rotation, rotation );
	cam.rotateLocal( rotation );
	rotation[0] = 0.3;
	rotation[1] = 0.0;
	rotation[2] = 0.0;
	quat4.calculateW( rotation, rotation );
	cam.rotateLocal( rotation );

	this.battle.commander0 = e.commander0;
	this.battle.commander1 = e.commander1;
	
	this.battle.units = new Array();
	// Init Units and Units View for the Attacker Commander
	var units = this.battle.commander0.units;
	for ( var i=0; i<units.length; i++ ) {
	    this.battle.units.push( units[i] );
	    if ( i < 5 ) {
		units[i].setPos( i * 2 + 1, 0 );
	    } else {
		units[i].setPos( 10, 0 );
	    }
	    this.battle.unitViews.push( new BattleUnitView( units[i], 0 ) );
	}

	// Init Units and Units View for the Defender Commander
	units = this.battle.commander1.units;
	for ( var i=0; i<units.length; i++ ) {
	    this.battle.units.push( units[i] );
	    units[i].setPos( i * 2, 31 );
	    this.battle.unitViews.push( new BattleUnitView( units[i], 1 ) );
	}


	this.battle.currentUnitID = -1;
	dispatcher.broadcast( { name: "NextUnit" } );
    }

    dispatcher.addListener( "NextUnit", this );
    this.onNextUnit = function( e ) {
	if ( -1 != this.battle.currentUnitID ) {
	    this.battle.units[this.battle.currentUnitID].requestUpdate();
	}
	this.battle.currentUnitID++;
	if ( this.battle.units.length == this.battle.currentUnitID ) {
	    this.battle.currentUnitID = 0;
	}
	var obj = this.battle.units[this.battle.currentUnitID];
	obj.requestUpdate();
	this.battle.reachable = batMap.getReachable( obj.u, obj.v, obj.template.spd );
	batMapView.requestUpdate();
    }

    dispatcher.addListener( "UnitMove", this );
    this.onUnitMove = function( e ) {
	if ( ! this.battle.onAnimation ) {
	    for ( var i=0; i<this.battle.reachable.length; i++ ) {
		if ( this.battle.reachable[i].u == e.u &&
		     this.battle.reachable[i].v == e.v ) {
		    trace( "go!" );
		    return;
		}
	    }
	    trace( "not go!" );
	}
    }
}
Logic.prototype = new GameObject;




