var starImage = new Image();
starImage.src = "img/star.png";

var StarSolarView = function( m ) {
    this.setModel( m );
	this.that = this;
    /// Do register a view on stage !!!
    this.register( solarSystem );
    
    this.draw = function()
	{
		//tilt camera and then draw
		if(this.left == 1)
		{
			cam.circleZ();
		}
		if(this.right == 1)
		{
			cam.circleNZ();
		}
		if(this.up == 1)
		{
			cam.rotateUp();
		}
		if(this.down == 1)
		{
			cam.rotateDown();
		}
		this.model.starModel.draw();
		starfield.draw();
		cam.update();
    }
	
	this.onKeyDown = function(key)
	{
		switch(key)
		{
			// When one direction is set to 1, the other direction is set to 0
			// This ameliorates an issue where javascript lags a little and the keyUp event is never fired
			case 37: // left arrow
				this.left = 1;
				this.right = 0;
				break;
			case 38: // up arrow
				this.up = 1;
				this.down = 0;
				break;
			case 39: // right arrow
				this.right = 1;
				this.left = 0;
				break;
			case 40: // down arrow
				this.down = 1;
				this.up = 0;
				break;
		}
	}
	this.onKeyUp = function(key)
	{
		switch(key)
		{
			case 37: // left arrow
				this.left = 0;
				break;
			case 38: // up arrow
				this.up = 0;
				break;
			case 39: // right arrow
				this.right = 0;
				break;
			case 40: // down arrow
				this.down = 0;
				break;
		}
	}
	
	this.onLeftMouseDown = function(x, y)
	{
		console.log("hello");
	}
}
StarSolarView.prototype = new View();

var StarUniverseView = function( m )
{
	this.setModel(m);
	this.that = this;
	this.register(universe);
	
	this.draw = function()
	{
		var scale = univMapView.radius * 1.5;
		ctxBg2d.drawImage(starImage, this.model.position[0] - scale / 2, this.model.position[1] - scale / 2, scale, scale);
	}
}
StarUniverseView.prototype = new View();


function adjustAngle(angle, viewAngle, mouse, distance) {
	var magicNum = 11.37777777 * 3;
	var center = distance / 2;
	return (mouse - center) / magicNum;
	
}

function startRayCheck(planetList, mx, my) {
		var rayLen = 100;
		var position = new Array();
		position[0] = cam.position[0];
		position[1] = cam.position[1];
		position[2] = cam.position[2];
		var rotation = new Array();
		rotation[0] = cam.orientation[0];
		rotation[1] = cam.orientation[1];
		rotation[2] = cam.orientation[2];
		
		rotation[0] = adjustAngle(rotation[0], 90, mx, 1024);
		rotation[1] = adjustAngle(rotation[1], 90 * (3/4), my, 768);
		var rayDir = [position[0] + rayLen * Math.sin(degToRad(rotation[0])) * Math.cos(degToRad(rotation[1])),
						position[1] - rayLen * Math.sin(degToRad(rotation[1])),
						position[2] - rayLen * Math.cos(degToRad(rotation[0])) * Math.cos(degToRad(rotation[1]))];
		console.log("planet1: " + planetList[0].position[0] + " "  + planetList[0].position[1] + " "  + planetList[0].position[2]);
		console.log("ray dirrection: " + rayDir);
		return rayCheck(rayDir, position, planetList);
	}
	
function rayCheck (direction, position, planetList) {
	var rayIter = 500;
	for (var t = 0; t <= 1; t += rayIter) {
		var rx = position[0] + ((direction[0] - position[0]) * t);
		var ry = position[1] + ((direction[1] - position[1]) * t);
		var rz = position[2] + ((direction[2] - position[2]) * t);
		for (var i = 0; i < planetList.length; i++) {
			if (rx >= (planetList[i].position[0] - (planetList[i].radius)) && rx <= (planetList[i].position[0] + (planetList[i].radius))) {
				if (ry >= (planetList[i].position[1] - (planetList[i].radius)) && ry <= (planetList[i].position[1] + (planetList[i].radius))) {
					if (rz >= (planetList[i].position[2] - (planetList[i].radius)) && rz <= (planetList[i].position[2] + (planetList[i].radius))) {
						return planetList[i];
					}
				}
			}
		}
	}
	return null;
}
    


var Star = function(texture, x, y, z, radius) {
	this.visiting = null;
    this.group = 0;
    this.quantities = new Array();
    for ( var i=0; i<UnitTypes.length; i++ ){
		this.quantities[i] = 1;
    }
    this.position = vec3.create();
	this.position[0] = x;
	this.position[1] = y;
	this.position[2] = z;
    this.radius = 3;//radius;
	this.starModel = new Model("ball.obj", texture);
	this.starModel.setPosition(this.position[0], this.position[1], this.position[2]);
	this.starModel.setScale(this.radius, this.radius, this.radius);
	this.starModel.useLighting(false);

    /// Add views:
    new StarSolarView( this );
    /*
    this.addView( new StarUniverseView( this ) );
    */
	
    /// do init a game object before using it
    this.init();
    this.active = true;
	this.update = function()
	{
		for(var i = 0; i < this.planets.length; i++)
		{
			this.planets[i].update();
		}
	}
	
	this.planets = new Array();
	var radii = [random(7,8), random(14, 16), random(19, 22)];
	var radii2 = [random(10,12)];
	var textures1 = ["testPlanet.png", "planet2.png", "planet9.png", "planet7.png"]; // habitable
	var textures2 = ["planet3.png", "planet4.png", "planet5.png", "planet6.png", "planet8.png", "planet10.png", "planet11.png", "planet12.png"]; // barren 68 10 11 12
	
	var planet2 = new Planet(textures1[Math.floor(Math.random()*textures1.length)], "clouds.png", -8, 0, -20, 1, radii2[0], this, new PlanetInfo(null, "Joe"));
	planet2.orbitVelocity = 0.003 / planet2.orbitRadius;
	this.planets.push(planet2); 
	
	for(var i = 0; i < radii.length; i++)
	{
		var x = Math.random();
		if(x > 2) // 50% chance of a planet in each orbit
		{
			var planet = new Planet(textures2[Math.floor(Math.random()*textures2.length)], null, -8, 0, -20, (Math.random() * 1.5) + 0.5, radii[i], this, null);
			planet.orbitVelocity = 0.003 / planet.orbitRadius;
			this.planets.push(planet);
		}
	}
	
	dispatcher.addListener( "MouseMove", this );
	this.onMouseMove = function( e ) {
		
	}
	
	
	
	this.miners; // number of miners in the system
}
Star.prototype = new GameObject();
