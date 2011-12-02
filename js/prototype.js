/// Set Current Rendering Stage
game.setStage( universe );



/// LogicViews:
var univLogicView = new UniverseLogicView( logic );


/// Create Universe Map
var univMap = new HexagonMap( 12, 10 );
var univMapView = new HexagonGridView( univMap, 50, 50, 20.0 );


/// Player Commander
var commanders = new Array();
var commanderUnivViews = new Array();
commanders.push( new Commander( 0, 2, 5 ) )
commanderUnivViews.push( new CommanderUniverseView( commanders[0] ) );
commanders.push( new Commander( 0, 7, 10 ) )
commanderUnivViews.push( new CommanderUniverseView( commanders[1] ) );


var testStar = new Star("star1.png", 0, 0, -20, 2);
var testPlanet = new Planet("testPlanet.png", "clouds.png", -8, 0, -20, 1);
game.play();



