ddprototype.html 		The game webpage
img/				The image files
animation/			The animation images
models/				The 3D models
textures/			Textures for 3D models
css/				Cascading Style Sheet for the game webpage
js/				The javascript files
	prototype.js		The javascript program for the level
	component/		The javascript programs that are not part of the game engine
	    AttackEffects.js	The Animations for Attack Effects
	    BattleMap.js	The Game Objects on the Battl Field
	    BattleUnit.js	The Battle Uints and the Commander Objects
	    force.js		The forces. Each force is just an empire. The AI system is in it.
	    global.js		Some global settings.
	    HexagonMap.js	The Hexagon Cell Map for both battlefield and the universe.
	    loading.js		Resources loading (images, etc )
	    logic.js		The main workflow of the game
	    menu.js		The menus / panels for universe.
	    PlanetInfo.js	Names for randomly generated planets.
	    PlanetMenu.js	The Menu in the solar system stage.
	    SolarSystemNames.js	Names for randomly generated solar systems.
	    UniverseObject.js	Mine Planet Objects.
	    UniverseViews.js	The look and feel / the mouse event handling programs of the universe.
	engine/			The Game Engine Programs
	    bezier.js  		Function for creating a bezier curve. (Currently not used)
	    bubble.js  		For creating pop up bubble menus.
	    button.js  		Used to create the buttons outside of the solar system.
	    camera.js  		Used to move and rotate the 3D camera.
	    engine.js 		Basic game loop for drawing objects and updating them. This is done through the stage.js and event.js
	    event.js  		Used for adding action listeners and sending out action events.
	    functions.js  	Some basic functions such as random()
	    glMatrix.min.js  	Used for matrix operations.
	    graphics.js 	Sets up and handles different context layers, both 2D and 3D.
	    jquery-1.6.4.js  	JQuery
	    keyboard.js  	Used to handle keyboard events and send out events.
	    modelObject.js  	Loads, holds, and draws 3D models. Also has functions to manipulate the models.
	    mouse.js  		Listens for mouse events and then dispatches them.
	    movieclip.js  	Handles 2D animations.
	    object.js  		Holds all of the game objects and handles the communication between them.
	    planet.js  		Holds basic information on planet and displays a planet.
	    resource.js  	Handles all of the image resources for the game.
	    shaders.js  	Has all of the functions to work with shaders. Actual shaders are in prototype.html.
	    shortcuts.js  	Shortcuts for some functions such as console.log().
	    stage.js  		There are 3 stages, universe, solar system, and battle. Stage handles the drawing and updating methods for these.
	    star.js  		Holds information about the entire solar system, along with the planets it has and the displays in the solar system.
	    starField.js  	The background star field in the solar system view.
	    tween.js  		Used for animations.
	    view.js  		Views are used to display objects. Each view is registered with a stage and only displayed when that stage is the current stage.