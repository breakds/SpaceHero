var forces = new Array();
var Force = function( name, type, color ) {
    this.groupID = forces.length;
    forces.push( this );
    /*
     * type can be "AI" or "Player"
     */
    this.type = type;
    this.name = name;
    this.gold = 5000;
    this.colorFlag = resources.getResource( color + "Flag" );
    trace( this.colorFlag );

    /// Commanders that belongs to this force
    this.commanders = new Array();

    this.mines = new Array();
    this.declareMine = function( mine ) {
	var idx = this.mines.indexOf( mine );
	if ( -1 == idx ) {
	    this.mines.push( mine );
	    mine.landlord = this;
	    this.updateIncome();
	}
    }

    this.removeMine = function( mine ) {
	var idx = this.mines.indexOf( mine );
	if ( -1 != idx ) {
	    this.mines.slice( idx, 1 );
	    mine.landlord = null;
	    this.updateIncome();
	}
    }
    
    this.income = 0;
    this.updateIncome = function() {
	this.income = 0;
	for ( var i=0; i<this.mines.length; i++ ) {
	    this.income += this.mines[i].income;
	}
	this.requestUpdate();
    }

    this.solars = new Array();


    this.setID = function( id ) {
	this.groupID = id;
    }
    
    this.createCommander = function( title, name, u, v ) {
	this.commanders.push( new Commander( title, name, this.groupID, u, v ) );
	new CommanderUniverseView( this.commanders[this.commanders.length-1] );
    }
    
    this.removeCommander = function( cmder ) {
	this.commanders.splice( this.commanders.indexOf( cmder ), 1 );
    }
    if ( "AI" == this.type ) {
	this.thinking = false;
	this.update = function() {
	    if ( this.thinking ) {
		this.tick++;
		if ( 0 != this.tick % 5 ) return;
		for ( var i=0; i<this.commanders.length; i++ ) {
		    if ( this.commanders[i].AP > 0 ) {
			do { 
			    this.commanders[i].setOrientation( Math.floor( Math.random() * 6 ) );
			} while ( ! this.commanders[i].stepForward() );
			return;
		    }
		}
		this.thinking = false;
		dispatcher.broadcast( { name: "EndTurn", 
					groupID: this.groupID } );
	    }
	}
	this.go = function() {
	    this.tick = 0;
	    this.thinking = true;
	}
	this.init();
    }
    
    dispatcher.addListener( "EndTurn", this );
    this.onEndTurn = function( e ) {
	if ( e.groupID == this.groupID ) {
	    for ( var i=0; i<this.commanders.length; i++ ) {
		this.commanders[i].AP = 0;
	    }
	}
    }

    dispatcher.addListener( "NewTurn", this );
    this.onNewTurn = function( e ) {
	for ( var i=0; i<this.commanders.length; i++ ) {
	    this.commanders[i].restoreAP();
	}
    }
}
Force.prototype = new GameObject;


