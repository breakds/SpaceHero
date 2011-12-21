/// Forces
new Force( "The Republic", "Player", "blue"  );
new Force( "The Empire", "AI", "red" );

game.setStage( universe );


/// LogicViews:
var univLogicView = new UniverseLogicView( logic );
var reporter = new BattleReporter( logic );
var reporterAnim = new ReporterAnimation();


/// Force View:
var playerForceView = new ForceUniverseView( forces[0], 800, 120 );


// Gnerate Universe Map
var univMap = new HexagonMap( 14, 18 );
var univMapView = new HexagonGridView( univMap, 750, 750, 50 );


/// The Republic Base
new Star( "star1.png", 0, 0, 0, 2, 2, 3 );
stars[0].setOwner( forces[0] );

/// The Empire Base
new Star( "star1.png", 0, 0, 0, 2, 15, 24 );
stars[1].setOwner( forces[1] );
new Star( "star1.png", 0, 0, 0, 2, 2, 21 );



/// Mines
new MineStar( 14, 17 );
new MineStar( 10, 11 );


/// The Commanders
forces[0].createCommander( "Admiral", "Gideon", 3, 4 );
forces[0].commanders[0].addUnit( Gunboat );
forces[0].commanders[0].units[0].setQuantity( 20 );
forces[0].commanders[0].addUnit( Fighter );
forces[0].commanders[0].units[1].setQuantity( 20 );
forces[0].commanders[0].addUnit( Sniper );
forces[0].commanders[0].units[2].setQuantity( 3 );


forces[1].createCommander( "King", "Angus", 14, 23 );
forces[1].commanders[0].addUnit( Gunboat );
forces[1].commanders[0].units[0].setQuantity( 10 );
forces[1].commanders[0].addUnit( Fighter );
forces[1].commanders[0].units[1].setQuantity( 20 );
forces[1].commanders[0].addUnit( Warship );
forces[1].commanders[0].units[2].setQuantity( 100 );





var starfield = new StarField();
cam.viewMode = "star";
cam.viewObject = stars[0];


/// Create Battle Map
var batMap = new HexagonMap( 15,11 );
var batMapView = new BattleHexagonView( batMap, 30 );



/// Trace Commanders
for ( var i=0; i<forces[0].commanders.length; i++ ) {
    trace( forces[0].commanders[i].name + ": " + 
	   forces[0].commanders[i].getPower() );
}
for ( var i=0; i<forces[1].commanders.length; i++ ) {
    trace( forces[1].commanders[i].name + ": " + 
	   forces[1].commanders[i].getPower() );
}

var planetMenu = new PlanetMenu();

game.play();

