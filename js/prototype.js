/// Set Current Rendering Stage
game.setStage( universe );
//solarSystem / universe


/// LogicViews:
var univLogicView = new UniverseLogicView( logic );


/// Create Universe Map
var univMap = new HexagonMap( 14, 18 );
var univMapView = new HexagonGridView( univMap, 750, 750, 50 );

/// Player Commander
var commanders = new Array();
var commanderUnivViews = new Array();
var commanderMenuViews = new Array();
commanders.push( new Commander( "General", "Button", 0, 2, 5 ) )
commanderUnivViews.push( new CommanderUniverseView( commanders[0] ) );
commanders.push( new Commander( "General", "Rommel", 0, 7, 10 ) )
commanderUnivViews.push( new CommanderUniverseView( commanders[1] ) );

/// Star systems
var stars = new Array();
for(var i = 0; i < commanders.length; i++)
{
	var u = commanders[i].u + univMap.du[0];
	var v = commanders[i].v + univMap.dv[0];
	var xy = univMapView.getXYFromUV(u, v);
	univMap.terran[u][v] = new Star("star1.png", xy.x, xy.y, -20, 2);
}




game.play();



