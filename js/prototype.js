/// Create Forces
new Force( "The Republic", "Player"  );
new Force( "The Empire", "AI" );


/// Set Current Rendering Stage
game.setStage( universe );
//solarSystem / universe


/// LogicViews:
var univLogicView = new UniverseLogicView( logic );


/// Create Universe Map
var univMap = new HexagonMap( 14, 18 );
var univMapView = new HexagonGridView( univMap, 750, 750, 50 );
univMap.addSolarSystem( 2, 3);



/// Create Battle Map
var batMap = new HexagonMap( 15,11 );
var batMapView = new BattleHexagonView( batMap, 30 );



/// Player Commander
forces[0].createCommander( "General", "Lionheart", 2, 5 );
forces[0].commanders[0].addUnit( Warship );
forces[0].commanders[0].units[0].setQuantity( 4 );
forces[0].commanders[0].addUnit( Gunboat );
forces[0].commanders[0].units[1].setQuantity( 20 );
forces[0].commanders[0].addUnit( Cruiser );
forces[0].commanders[0].units[2].setQuantity( 3 );
forces[0].commanders[0].addUnit( Sniper );
forces[0].commanders[0].units[3].setQuantity( 5 );


forces[1].createCommander( "General", "Luther", 7, 10 );
forces[1].commanders[0].addUnit( Fighter );
forces[1].commanders[0].units[0].setQuantity( 50 );
forces[1].commanders[0].addUnit( Warrior );
forces[1].commanders[0].addUnit( Sniper );
forces[1].commanders[0].units[2].setQuantity( 3 );


var planetMenu = new PlanetMenu();


game.play();
/*
dispatcher.broadcast( {name: "StartBattle",
		       commander0: forces[0].commanders[0],
		       commander1: forces[1].commanders[0] } );
*/





