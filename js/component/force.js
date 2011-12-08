var forces = new Array();
var Force = function( name, type ) {
    this.groupID = forces.length;
    forces.push( this );
    /*
     * type can be "AI" or "Player"
     */
    this.type = type;
    this.name = name;
    this.gold = 5000;

    /// Commanders that belongs to this force
    this.commanders = new Array();

    /// Solar Systems that belongs to this force
    this.solarSystems = new Array();
    
    this.setID = function( id ) {
	this.groupID = id;
    }
    
    this.createCommander = function( title, name, u, v ) {
	this.commanders.push( new Commander( title, name, this.groupID, u, v ) );
	new CommanderUniverseView( this.commanders[this.commanders.length-1] );
    }
}


