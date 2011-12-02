/// Set Current Rendering Stage
game.setStage( universe );



/// LogicViews:
var univLogicView = new UniverseLogicView( logic );


/// Create Universe Map
var univMap = new HexagonMap( 10, 16 );
var univMapView = new HexagonGridView( univMap, 768, 1024, 50 );

var stars = new Array();

// Populate map with stars
for(var i = 0; i < univMap.rows; i++)
{
	for(var j = 0; j < univMap.cols; j++)
	{
		if(Math.random() < 0.1 && univMap.available(i, j))
		{
			stars.push(new Star("star1.png"), 0, 0, -20, 2);
		}
	}
}

/// Player Commander
var commander = new Commander(0);
commander.setPos( 2,5 );
var commanderUnivView = new CommanderUniverseView( commander );


var testStar = new Star("star1.png", 0, 0, -20, 2);
var testPlanet = new Planet("testPlanet.png", "clouds.png", -8, 0, -20, 1);
game.play();



