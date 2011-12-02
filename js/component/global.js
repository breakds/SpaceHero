/// Camera
var cam = new Camera();

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
var testStar = new Star("star1.png", 0, 0, -20, 2);
var testPlanet = new Planet("testPlanet.png", "clouds.png", -8, 0, -20, 1);
cam.viewMode = "star";
cam.viewObject = testStar;
initialRotation = quat4.create();
initialRotation[0] = -0.5;
initialRotation[1] = 0;
initialRotation[2] = 0;
quat4.calculateW(initialRotation);
cam.rotateGlobal(initialRotation);



/// Create Logic
var logic = new Logic();

