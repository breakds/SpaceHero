/// Set Current Rendering Stage
game.setStage( universe );



/// LogicViews:
var univLogicView = new UniverseLogicView( logic );


/// Create Universe Map
var univMap = new HexagonMap( 10, 16 );
var univMapView = new HexagonGridView( univMap, 768, 1024, 50 );

var stars = new Array();

// Populate map with stars
/*
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
*/

/// Player Commander
var commanders = new Array();
var commanderUnivViews = new Array();
commanders.push( new Commander( 0, 2, 5 ) )
commanderUnivViews.push( new CommanderUniverseView( commanders[0] ) );
commanders.push( new Commander( 0, 7, 10 ) )
commanderUnivViews.push( new CommanderUniverseView( commanders[1] ) );

game.play();



