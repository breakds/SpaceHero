/// Set Current Rendering Stage
game.setStage( universe );



/// LogicViews:
var univLogicView = new UniverseLogicView( logic );


/// Create Universe Map
var univMap = new HexagonMap( 12, 10 );
var univMapView = new HexagonGridView( univMap, 50, 50, 20.0 );


/// Player Commander
var commander = new Commander( 0 );
commander.setPos( 2,5 );
var commanderUnivView = new CommanderUniverseView( commander );


var testStar = new Star("star1.png", 0, 0, -20, 2);
var testPlanet = new Planet("testPlanet.png", "clouds.png", -8, 0, -20, 1);
game.play();



