/// Create Forces
new Force( "The Republic", "Player", "blue"  );
new Force( "The Empire", "AI", "red" );


/// Set Current Rendering Stage
game.setStage( universe );
//solarSystem / universe


/// LogicViews:
var univLogicView = new UniverseLogicView( logic );
var reporter = new BattleReporter( logic );
var reporterAnim = new ReporterAnimation();


/// Force View:
var playerForceView = new ForceUniverseView( forces[0], 800, 120 );

/// Create Universe Map
var univMap = new HexagonMap( 14, 18 );
var univMapView = new HexagonGridView( univMap, 750, 750, 50 );
var mineStar = new MineStar( 2, 11 );
new Star("star1.png", 0, 0, 0, 2, 2, 3 );
stars[0].setOwner( forces[0] );
new Star("star1.png", 0, 0, 0, 2, 2, 9 );
stars[1].setOwner( forces[0] );



var starfield = new StarField();
cam.viewMode = "star";
cam.viewObject = stars[0];



/// Create Battle Map
var batMap = new HexagonMap( 15,11 );
var batMapView = new BattleHexagonView( batMap, 30 );



/// Player Commander
forces[0].createCommander( "General", "Lionheart", 2, 5 );
forces[0].commanders[0].setAttack( 12 );
forces[0].commanders[0].setDefence( 20 );
forces[0].commanders[0].addUnit( Warrior );
forces[0].commanders[0].units[0].setQuantity( 10 );
forces[0].commanders[0].addUnit( Gunboat );
forces[0].commanders[0].units[1].setQuantity( 80 );
forces[0].commanders[0].addUnit( Cruiser );
forces[0].commanders[0].units[2].setQuantity( 5 );
forces[0].commanders[0].addUnit( Sniper );
forces[0].commanders[0].units[3].setQuantity( 15 );




forces[0].createCommander( "Trainer", "Talon", 2, 1 );
forces[0].commanders[1].setAP( 8 );
forces[0].commanders[1].addUnit( Dragon );




forces[1].createCommander( "General", "Luther", 3, 4 );
forces[1].commanders[0].addUnit( Warship );
forces[1].commanders[0].units[0].setQuantity( 10 );
forces[1].commanders[0].addUnit( Fighter );
forces[1].commanders[0].units[1].setQuantity( 100 );
forces[1].commanders[0].addUnit( Warrior );
forces[1].commanders[0].units[0].setQuantity( 5 );




forces[1].createCommander( "General", "Frenzy", 9, 18 );
forces[1].commanders[1].setAttack( 4 );
forces[1].commanders[1].setDefence( 6 );
forces[1].commanders[1].addUnit( Warrior );
forces[1].commanders[1].units[0].setQuantity( 12 );
forces[1].commanders[1].addUnit( Gunboat );
forces[1].commanders[1].units[1].setQuantity( 30 );


forces[1].createCommander( "General", "Shooter", 6, 11 );
forces[1].commanders[2].setAttack( 15 );
forces[1].commanders[2].setDefence( 2 );
forces[1].commanders[2].addUnit( Cannon );
forces[1].commanders[2].addUnit( Cannon );
forces[1].commanders[2].addUnit( Cannon );




for ( var i=0; i<forces[0].commanders.length; i++ ) {
    trace( forces[0].commanders[i].name + ": " + 
	   forces[0].commanders[i].getPower() );
}
for ( var i=0; i<forces[1].commanders.length; i++ ) {
    trace( forces[1].commanders[i].name + ": " + 
	   forces[1].commanders[i].getPower() );
}





var planetMenu = new PlanetMenu();

/*
new BubbleDialog( "Hello Everyone please gasdfgasdf gasdf gasdf gasdf gasdf gasdf gasdf", "textfield1", universe, 500, 400, 400, 300 );
*/
game.play();







