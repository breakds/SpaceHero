/// Create Universe Stage
var universe = new Stage();
universe.addContext( ctxBg2d );

/// Create Solar System Stage
var solarSystem = new Stage();
solarSystem.enable3D = true;



/// Set Current Rendering Stage
game.setStage( universe );



/// Create Universe Map
var univMap = new HexagonMap( 12, 10 );
var univMapView = new HexagonGridView( univMap, 50, 50, 20.0 );



var testStar = new Star("star1.png", 0, 0, -20, 2);
var testPlanet = new Planet("testPlanet.png", "clouds.png", -8, 0, -20, 1);
game.play();
