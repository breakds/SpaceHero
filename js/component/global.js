/// Resources
resources.addImage( "img/commander.png", "commanderImg" );
resources.addImage( "img/greenarrow.png", "greenArrowImg" );
resources.addImage( "img/target.png", "targetImg" );

/// Create Universe Stage
var universe = new Stage();
universe.addContext( ctxBg2d );
universe.addContext( ctx2d[0] );
universe.addContext( ctx2d[1] );

/// Create Solar System Stage
var solarSystem = new Stage();
solarSystem.enable3D = true;


/// Create Logic
var logic = new Logic();

