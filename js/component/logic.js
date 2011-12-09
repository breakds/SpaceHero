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
    this.attackable = new Array();
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

	/// Acquire Reachable Array
	this.battle.reachable = batMap.getReachable( obj.u, obj.v, obj.template.spd );

	/// Acquire Attackable Array
	var u = 0;
	var v = 0;
	var enemy = null;
	this.battle.attackable = new Array();
	for ( var i=0; i<this.battle.reachable.length; i++ ) {
	    for ( var j=0; j<6; j++ ) {
		u = this.battle.reachable[i].u + batMap.du[j];
		v = this.battle.reachable[i].v + batMap.dv[j];
		enemy = batMap.getMap( u, v );
		if ( -1 != enemy && 0 != enemy ) {
		    if ( enemy.leader.group != obj.leader.group ) {
			var flag = false;
			for ( var k=0; k<this.battle.attackable.length; k++ ) {
			    if ( this.battle.attackable[k].u == u &&
				 this.battle.attackable[k].v == v ) {
				flag = true;
				break;
			    }
			}
			if ( !flag ) {
			    this.battle.attackable.push( { u: u,
							   v: v,
							   nu: this.battle.reachable[i].u,
							   nv: this.battle.reachable[i].v } );
			}
		    }
		}
	    }
	}
	
	batMapView.requestUpdate();

	/// Temporary AI:
	if ( 0 != obj.leader.group ) {
	    var pick = Math.floor( Math.random() * this.battle.reachable.length );
	    dispatcher.broadcast( { name: "UnitMove",
				    obj: obj,
				    u: this.battle.reachable[pick].u,
				    v: this.battle.reachable[pick].v } );
	}
    }

    dispatcher.addListener( "UnitMove", this );
    this.onUnitMove = function( e ) {
	if ( ! this.battle.onAnimation ) {
	    for ( var i=0; i<this.battle.reachable.length; i++ ) {
		if ( this.battle.reachable[i].u == e.u &&
		     this.battle.reachable[i].v == e.v ) {
		    var path = new Array();
		    var j = i;
		    while ( this.battle.reachable[j].pre != -1 ) {
			path.push( { u: this.battle.reachable[j].u,
				     v: this.battle.reachable[j].v } );
			j = this.battle.reachable[j].pre;
		    }
		    new UnitMoveAnimation( e.obj, path );
		    return;
		}
	    }
	}
    }
}
Logic.prototype = new GameObject;




