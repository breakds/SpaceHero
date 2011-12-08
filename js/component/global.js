/// Camera
var cam = new Camera();

/// Resources
resources.addImage( "img/commander.png", "commanderImg" );
resources.addImage( "img/commanderSelect.png", "commanderSelectImg" );
resources.addImage( "img/greenarrow.png", "greenArrowImg" );
resources.addImage( "img/target.png", "targetImg" );
resources.addImage( "img/shieldicon.png", "shieldIcon" );
resources.addImage( "img/swordicon.png", "swordIcon" );
resources.addImage( "img/redtarget.png", "redTargetImg" );
resources.addImage( "img/redarrow.png", "redArrowImg" );


/// Create Universe Stage
var universe = new Stage();
universe.addContext( ctxBg2d );
universe.addContext( ctx2d[0] );
universe.addContext( ctx2d[1] );
universe.addContext( ctxMenu );



/// Create Solar System Stage
var solarSystem = new Stage();
solarSystem.enable3D = true;
var testStar = new Star("star1.png", 0, 0, -20, 2);
cam.viewMode = "star";
cam.viewObject = testStar;
initialRotation = quat4.create();
initialRotation[0] = -.6;
initialRotation[1] = 0;
initialRotation[2] = 0;
quat4.calculateW(initialRotation);
cam.rotateGlobal(initialRotation);



/// Create Logic
var logic = new Logic();

/// button for turns
var btnEndTurn = new Button( "End Turn", "#005599", 
			     880, 50, 80, 30, universe, ctxMenu );
btnEndTurn.onRelease = function() {
    dispatcher.broadcast( { name:"EndTurn" } );
}




