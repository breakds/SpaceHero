/// Create Forces
new Force( "The Republic", "Player"  );
new Force( "The Empire", "AI" );


/// Set Current Rendering Stage
game.setStage( universe );
//solarSystem / universe


/// LogicViews:
var univLogicView = new UniverseLogicView( logic );
var reporter = new BattleReporter( logic );
var reporterAnim = new ReporterAnimation();

/// Create Universe Map
var univMap = new HexagonMap( 14, 18 );
var univMapView = new HexagonGridView( univMap, 750, 750, 50 );
univMap.addSolarSystem( 2, 3);



/// Create Battle Map
var batMap = new HexagonMap( 15,11 );
var batMapView = new BattleHexagonView( batMap, 30 );



/// Player Commander
forces[0].createCommander( "General", "Lionheart", 2, 5 );
forces[0].commanders[0].setAttack( 12 );
forces[0].commanders[0].setDefence( 20 );
forces[0].commanders[0].addUnit( Warship );
forces[0].commanders[0].units[0].setQuantity( 4 );
forces[0].commanders[0].addUnit( Gunboat );
forces[0].commanders[0].units[1].setQuantity( 40 );
forces[0].commanders[0].addUnit( Cruiser );
forces[0].commanders[0].units[2].setQuantity( 5 );
forces[0].commanders[0].addUnit( Sniper );
forces[0].commanders[0].units[3].setQuantity( 5 );



forces[0].createCommander( "General", "Tester", 2, 1 );
forces[0].commanders[1].addUnit( Fighter );
forces[0].commanders[1].units[0].setQuantity( 90 );
forces[0].commanders[1].addUnit( Sniper );
forces[0].commanders[1].units[0].setQuantity( 10 );


forces[1].createCommander( "General", "Luther", 7, 10 );
forces[1].commanders[0].addUnit( Warship );
forces[1].commanders[0].units[0].setQuantity( 10 );
forces[1].commanders[0].addUnit( Fighter );
forces[1].commanders[0].units[1].setQuantity( 50 );
forces[1].commanders[0].addUnit( Warrior );
forces[1].commanders[0].units[2].setQuantity( 3 );



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
forces[1].commanders[2].addUnit( Sniper );
forces[1].commanders[2].units[0].setQuantity( 10 );
forces[1].commanders[2].addUnit( Gunboat );
forces[1].commanders[2].units[1].setQuantity( 10 );






var planetMenu = new PlanetMenu();


game.play();
/*
dispatcher.broadcast( {name: "StartBattle",
		       commander0: forces[0].commanders[0],
		       commander1: forces[1].commanders[0] } );
*/





