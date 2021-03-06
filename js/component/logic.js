var GameStatus = function() {
    this.onSelect = null;
    this.showArrows = false;
    this.onAnimation = 0;
    this.commanderMenu = null;
    this.turn = 1;
    this.month = 1;
    this.year = 3000;
    this.nextTurn = function() {
	this.turn++;
	this.month++;
	if( 13 == this.month) {
	    this.month = 1;
	    this.year--;
	    dispatcher.broadcast( { name: "NewYear",
				    year: this.year } );
				    
	}
    }
    this.onTurn = forces[0];
    this.attackIcon = { u:-1, v:-1 };
}

var BattleStatus = function() {
    this.commander0 = null;
    this.commander1 = null;
    this.unitViews = new Array();
    this.units = new Array();
    this.initQuantity = new Array();
    this.turn = 0;
    this.currentUnitID = 0;
    this.reachable = new Array();
    this.attackable = new Array();
    this.onAnimation = false;
    this.leftPanel = null;
    this.rightPanel = null;
    this.leftUnitShown = null;
    this.rightUnitShow = null;
    this.destination = -1;
    this.returnThinking = null;
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
	if ( 0 == this.status.onAnimation ) {
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
    dispatcher.addListener( "DeselectCommander", this );
    this.onDeselectCommander = function( e ) {
	if ( this.status.onSelect ) {
	    this.status.onSelect.removeView( this.status.commanderMenu );
	    var obj = this.status.onSelect;
	    this.status.onSelect = null;
	    obj.requestUpdate();
	    this.status.commanderMenu = null;
	    this.requestUpdate();
	}
    }
    

    dispatcher.addListener( "RequestArrowPath", this );
    this.onRequestArrowPath = function( e ) {
	if ( (0 == this.status.onAnimation) && (!univMap.veil[e.target.u][e.target.v]) ) {
	    this.status.onSelect.target.u = e.target.u;
	    this.status.onSelect.target.v = e.target.v;
	    this.status.onSelect.updatePath();
	    this.status.showArrows = true;
	    this.requestUpdate();
	}
    }
    
    dispatcher.addListener( "CommanderMove", this );
    this.onCommanderMove = function( e ) {
	if ( 0 == this.status.onAnimation ) {
	    new CommanderMoveAnimation( this.status.onSelect );
	}
    }


    dispatcher.addListener( "CreateCommander", this );
    this.onCreateCommander = function( e ) {
	if ( 0 == this.status.onAnimation ) {
	    if ( e.star.owner.gold >= 2500 ) {

		var dialog = new BubbleDialog( 
		    "Are you sure that you want a new Commander? You need to pay 2500 gold to recruit a new Commander.", 
		    "textfield1",
		    universe,
		    512, 400, 280, 210 );
		dialog.onOK = function() {
		    var flag = true;
		    for ( var j=0; j<6; j++ ) {
			var u = e.star.u + univMap.du[j];
			var v = e.star.v + univMap.dv[j];
			if ( univMap.available( u, v) ) {
			    e.star.owner.createRandomCommander( u, v );
			    flag = true;
			    break;
			}
		    }
		} 
	    } else {
		var dialog = new BubbleDialog( 
		    "You don't have enough gold, sir. You need 2500 gold to recruit a new Commander.",
		    "textfield1",
		    universe,
		    512, 400, 280, 210 );
	    }
	}
    }
    

    dispatcher.addListener( "EndTurn", this );
    this.onEndTurn = function( e ) {
	if ( 0 == forces[0].solars.length &&
	     0 == forces[0].commanders.length ) {
	    var dialog = new BubbleDialog( "Unfortunaly you have lost all your solar systems and your commanders. You Lose.",
					   "textfield1",
					   universe,
					   512, 400, 300, 225 );
	    dialog.onOK = function() {
		window.location = "index.html";
	    }
	    dialog.onCancel = function() {
		window.location = "index.html";
	    }
	} else if ( 0 == forces[1].solars.length &&
		    0 == forces[1].commanders.length ) {

	    var dialog = new BubbleDialog( "Congratulations! The Victory is yours!",
					   "textfield1",
					   universe,
					   512, 400, 300, 225 );
	    dialog.onOK = function() {
		window.location = "index.html";
	    }
	    dialog.onCancel = function() {
		window.location = "index.html";
	    }
	}
	if ( 0 == this.status.onAnimation ) {
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
    }


    dispatcher.addListener( "EnterSolarSystem", this );
    this.onEnterSolarSystem = function( e ) {
	e.star.visiting = e.visiting;
	game.setStage( solarSystem );
    }


    
    /// Battle Part
    dispatcher.addListener( "StartBattle", this );
    this.onStartBattle = function( e ) {
	if ( 0 != this.status.onAnimation ) {
	    return ;
	}
	if ( e.returnThinking ) {
	    this.battle.returnThinking = e.returnThinking;
	} else {
	    this.battle.returnThinking = null;
	}
	reporter.clear();
	reporter.append( "Battle Start!" );
	game.setStage( battlefield );
	
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
		units[i].setPos( 10, 1 );
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

	/// Sort according 
	for ( var i=0; i<this.battle.units.length-1; i++ ) {
	    for ( var j=i+1; j<this.battle.units.length; j++ ) {
		if ( this.battle.units[j].template.spd > 
		     this.battle.units[i].template.spd ||
		     ( this.battle.units[j].template.spd ==
		       this.battle.units[i].template.spd &&
		       this.battle.units[j].leader == 
		       this.battle.commander0 ) ) {
		    var tmp = this.battle.units[i];
		    this.battle.units[i] = this.battle.units[j];
		    this.battle.units[j] = tmp;
		}
	    }
	}
	this.battle.initQuantity = new Array();
	for ( var i=0; i<this.battle.units.length; i++ ) {
	    this.battle.initQuantity.push( this.battle.units[i].quantity );
	}

	
	// Left Panel and Right Panel
	this.battle.leftPanel = new BattleCommanderView( this.battle.commander0, "left" );
	this.battle.rightPanel = new BattleCommanderView( this.battle.commander1, "right" );




	this.battle.currentUnitID = -1;
	dispatcher.broadcast( { name: "NextUnit" } );
    }

    dispatcher.addListener( "NextUnit", this );
    this.onNextUnit = function( e ) {
	var num0 = 0;
	var num1 = 0;
	for ( var i=0; i<this.battle.units.length; i++ ) {
	    if ( this.battle.units[i].active ) {
		if( this.battle.units[i].leader == this.battle.commander0 ) {
		    num0++;
		} else {
		    num1++;
		}
	    }
	}

	if ( 0 == num0 ) {
	    dispatcher.broadcast( { name: "ExitBattle", loser: this.battle.commander0 } );
	    return;
	} else if ( 0 == num1 ) {
	    dispatcher.broadcast( { name: "ExitBattle", loser: this.battle.commander1 } );
	    return;
	}

	
	if ( -1 != this.battle.currentUnitID ) {
	    if ( this.battle.units[this.battle.currentUnitID].active ) {
		this.battle.units[this.battle.currentUnitID].removeSelector();
		this.battle.units[this.battle.currentUnitID].requestUpdate();
	    }
	}
	this.battle.currentUnitID++;
	if ( this.battle.units.length == this.battle.currentUnitID ) {
	    this.battle.currentUnitID = 0;
	    reporter.append( "New Turn Started!" );
	}
	var obj = this.battle.units[this.battle.currentUnitID];
	if ( !obj.active ) {
	    dispatcher.broadcast( { name: "NextUnit" } );
	    return;
	}
	obj.createSelector();
	obj.requestUpdate();
	new UnitTurnStartAnimation( obj );


	/// Acquire Reachable Array
	this.battle.reachable = batMap.getReachable( obj.u, obj.v, obj.template.spd );

	/// Acquire Attackable Array
	var u = 0;
	var v = 0;
	var enemy = null;
	this.battle.attackable = new Array();
	if ( obj.template.archer ) {
	    for ( var i=0; i<this.battle.units.length; i++ ) {
		if ( this.battle.units[i].leader != obj.leader &&
		     this.battle.units[i].active ) {
		    this.battle.attackable.push( { 
			u: this.battle.units[i].u,
			v: this.battle.units[i].v,
			neighborID: -1 } );
		}
	    }
	} else {
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
							       neighborID: i } );
			    }
			}
		    }
		}
	    }
	}
	batMapView.requestUpdate();
    }

    
    dispatcher.addListener( "AIThinking", this );
    this.onAIThinking = function( e ) {
	/// Temporary AI:
	var obj = e.obj;
	if ( 0 != obj.leader.group ) {
	    if ( 0 != this.battle.attackable.length ) {
		/// Pick one to attack!
		var maxScore = -1;
		var pick = 0;
		for ( var i=0; i<this.battle.attackable.length; i++ ) {
		    var enemy = batMap.getMap(
			this.battle.attackable[i].u,
			this.battle.attackable[i].v
		    );
		    var score = enemy.powerLostEstimate( obj );
		    if ( score > maxScore ) {
			maxScore = score;
			pick = i;
		    }
		}
		this.battle.destination = this.battle.attackable[pick].neighborID;
		dispatcher.broadcast( { name: "UnitMove",
					obj: obj,
					u: this.battle.attackable[pick].u,
					v: this.battle.attackable[pick].v } );
	    } else {
		var pick = Math.floor( Math.random() * this.battle.reachable.length );
		dispatcher.broadcast( { name: "UnitMove",
					obj: obj,
					u: this.battle.reachable[pick].u,
					v: this.battle.reachable[pick].v } );
	    }
	}
    }


    dispatcher.addListener( "UnitMove", this );
    this.onUnitMove = function( e ) {
	if ( ! this.battle.onAnimation ) {
	    for ( var i=0; i<this.battle.attackable.length; i++ ) {
		if ( this.battle.attackable[i].u == e.u &&
		     this.battle.attackable[i].v == e.v ) {
		    var path = new Array();
		    var j = this.battle.attackable[i].neighborID;
		    if ( j != -1 ) {
			if ( -1 == this.battle.destination ) {
			    return;
			}
			j = this.battle.destination;
			while ( this.battle.reachable[j].pre != -1 ) {
			    path.push( { u: this.battle.reachable[j].u,
					 v: this.battle.reachable[j].v } );
			    j = this.battle.reachable[j].pre;
			}
			new UnitMoveAnimation( e.obj, path, batMap.getMap( e.u, e.v ) );
		    } else {
			if ( "Laser" == e.obj.template.attackStyle ) {
			    new LaserAttackAnimation( e.obj, batMap.getMap( e.u, e.v ) );
			} else {
			    new MissileAttackAnimation( e.obj, batMap.getMap( e.u, e.v ) );
			}
		    }
		    this.battle.reachable = new Array();
		    batMap.requestUpdate();
		    return;
		}
	    }
	    
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
		    new UnitMoveAnimation( e.obj, path, null );
		    this.battle.reachable = new Array();
		    batMap.requestUpdate();
		    return;
		}
	    }
	}
    }

    dispatcher.addListener( "ExitBattle", this );
    this.onExitBattle = function( e ) {
	this.battle.leftUnitShown = null;
	this.battle.rightUnitShown = null;
	/// Delete Views
	for ( var i=0; i<this.battle.unitViews.length; i++ ) {
	    this.battle.unitViews[i].model.removeView( this.battle.unitViews[i] );
	}
	this.battle.unitViews = new Array();
	/// Remove Dead Units / restore HP
	var exp0 = 0;
	var exp1 = 0;
	for ( var i=0; i<this.battle.units.length; i++ ) {
	    if ( this.battle.units[i].leader == this.battle.commander1 ) {
		trace( this.battle.initQuantity[i] +" * " +
		       this.battle.units[i].template.expGain );
		exp0 += this.battle.initQuantity[i] * 
		    this.battle.units[i].template.expGain;
	    } else {
		exp1 += this.battle.initQuantity[i] * 
		    this.battle.units[i].template.expGain;
	    }
	    if ( ! this.battle.units[i].active ) {
		this.battle.units[i].terminate();
	    } else {
		batMap.clearCell( this.battle.units[i].u,
				  this.battle.units[i].v );
		this.battle.units[i].removeSelector();
		this.battle.units[i].restoreHP();
	    }
	}
	this.battle.units = null;
	this.battle.commander0.removeView( this.battle.leftPanel );
	this.battle.commander1.removeView( this.battle.rightPanel );
	this.battle.leftPanel = null;
	this.battle.rightPanel = null;
	game.setStage( universe );
	if ( "defender" != e.loser.type ) {
	    new CommanderDeathAnimation( e.loser );
	}
	if ( this.battle.commander0 != e.loser ) {
	    trace( this.battle.commander0.name + " gains " + 
		   exp0 + " experience." );
	    this.battle.commander0.tryLevelUp( exp0 );
	} else {
	    trace( this.battle.commander1.name + " gains " + 
		   exp1 + " experience." );
	    this.battle.commander1.tryLevelUp( exp1 );
	}

	if ( "defender" == e.loser.type ) {
	    if ( this.battle.commander0 != e.loser ) {
		e.loser.star.setOwner( forces[ this.battle.commander0.group] );
		if ( 0 == this.battle.commander0.group ) {
		    var c = univMapView.getXYFromUV( 
			this.battle.commander0.u,
			this.battle.commander0.v );
		    new TimedBubble( new Bubble( 
			"Captured a new Solar System, Sir!", "textfield1", 
			universe, c.x, c.y,
			160, 40 ), 100 );
		}
	    } else {
		e.loser.star.setOwner( forces[ this.battle.commander1.group] );
		if ( 0 == this.battle.commander1.group ) {
		    var c = univMapView.getXYFromUV( 
			this.battle.commander0.u,
			this.battle.commander0.v );
		    new TimedBubble( new Bubble( 
			"Captured a new Solar System, Sir!", "textfield1", 
			universe, c.x, c.y,
			160, 40 ), 100 );
		}
	    }
	}
	if ( "defender" == this.battle.commander0.type ) {
	    this.battle.commander0.terminate();
	}
	if ( "defender" == this.battle.commander1.type ) {
	    this.battle.commander1.terminate();
	}
	
	if ( this.battle.returnThinking ) {
	    this.battle.returnThinking.thinking = true;
	}
    }
}
Logic.prototype = new GameObject;