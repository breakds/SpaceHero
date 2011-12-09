/// Camera
var cam = new Camera();

/// Resources
resources.addImage( "img/commander.png", "commander0Img" );
resources.addImage( "img/commander1.png", "commander1Img" );
resources.addImage( "img/commanderSelect.png", "commanderSelectImg" );
resources.addImage( "img/greenarrow.png", "greenArrowImg" );
resources.addImage( "img/target.png", "targetImg" );
resources.addImage( "img/shieldicon.png", "shieldIcon" );
resources.addImage( "img/swordicon.png", "swordIcon" );
resources.addImage( "img/redtarget.png", "redTargetImg" );
resources.addImage( "img/redarrow.png", "redArrowImg" );
resources.addImage( "img/solaronmap.png", "solarIconImg" );
resources.addImage( "img/beam_left.png", "beamLeft" );
resources.addImage( "img/projector_left.png", "projectorLeft");
resources.addImage( "img/planetMenu_left.png", "planetMenuLeft");
resources.addImage( "img/beam_right.png", "beamRight" );
resources.addImage( "img/projector_right.png", "projectorRight");
resources.addImage( "img/planetMenu_right.png", "planetMenuRight");
resources.addImage( "img/planetMenuProfilePic.png", "pmProfilePic");
/// Battle Units
resources.addImage( "img/fighter.png", "fighterImg" );
resources.addImage( "img/fighter_select.png", "fighterSelectImg" );
resources.addImage( "img/gunboat.png", "gunboatImg" );
resources.addImage( "img/gunboat_select.png", "gunboatSelectImg" );
resources.addImage( "img/warship.png", "warshipImg" );
resources.addImage( "img/warship_select.png", "warshipSelectImg" );
resources.addImage( "img/sniper.png", "sniperImg" );
resources.addImage( "img/sniper_select.png", "sniperSelectImg" );
resources.addImage( "img/cruiser.png", "cruiserImg" );
resources.addImage( "img/cruiser_select.png", "cruiserSelectImg" );
resources.addImage( "img/warrior.png", "warriorImg" );
resources.addImage( "img/warrior_select.png", "warriorSelectImg" );


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

/// Create Solar System Stage
var solarSystem = new Stage();
solarSystem.enable3D = true;
var testStar = new Star("star1.png", 0, 0, 0, 2);
var starfield = new StarField();
cam.viewMode = "star";
cam.viewObject = testStar;
solarSystem.addContext( ctxMenu );

/// Create Logic
var logic = new Logic();

/// button for turns
var btnEndTurn = new Button( "End Turn", "#005599", 
			     880, 50, 80, 30, universe, ctxMenu );
btnEndTurn.onRelease = function() {
    dispatcher.broadcast( { name:"EndTurn", 
			    groupID:0 } );
}




