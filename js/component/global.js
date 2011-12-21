/// Camera
var cam = new Camera();


/// experience
expLevel = new Array( 0,
		      1000,
		      2000,
		      3200,
		      4600,
		      6200,
		      8000,
		      10000,
		      12200,
		      14700 );
		      

/// Create Universe Stage
var universe = new Stage();
universe.addContext( ctxBg2d );
universe.addContext( ctx2d[0] );
universe.addContext( ctx2d[1] );
universe.addContext( ctxMenu );

/// Create Battle Field
var battlefield = new Stage();
battlefield.enable3D = true;

/// Create Battle Field
var battlefield = new Stage();
battlefield.addContext( ctxBg2d );
battlefield.addContext( ctx2d[0] );
battlefield.addContext( ctx2d[1] );
battlefield.addContext( ctx2d[2] );
battlefield.addContext( ctxMenu );

/// Create Solar System Stage
var solarSystem = new Stage();
solarSystem.enable3D = true;
solarSystem.addContext( ctxMenu );



var defaultLineWidth = ctxMenu.lineWidth;
var defaultTextAlign = ctxMenu.textAlign;
var defaultTextBaseline = ctxMenu.textBaseline;


/// Create Logic
var logic = new Logic();

/// button for turns
var btnEndTurn = new Button( "End Turn", "#005599", 
			     880, 50, 80, 30, universe, ctxMenu );
btnEndTurn.onRelease = function() {
    dispatcher.broadcast( { name:"EndTurn", 
			    groupID:0 } );
}




