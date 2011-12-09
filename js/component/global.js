/// Camera
var cam = new Camera();




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

/// Create Solar System Stage
var solarSystem = new Stage();
solarSystem.enable3D = true;
var testStar = new Star("star1.png", 0, 0, 0, 2);
var starfield = new StarField();
cam.viewMode = "star";
cam.viewObject = testStar;
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




