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
		cam.update();
		this.model.starModel.draw();
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



var Star = function(texture, x, y, z, radius) {
    this.position = vec3.create();
	this.position[0] = x;
	this.position[1] = y;
	this.position[2] = z;
    this.radius = radius;
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
    this.update = function()
	{
		for(var i = 0; i < this.planets.length; i++)
		{
			this.planets[i].update();
		}
    }
	
	this.planets = new Array();
	var radii = [4.0, 8.0, 12.0, 16.0];
	var textures = ["testPlanet.png", "planet2.png", "planet3.png", "planet4.png", "planet5.png"];
	for(var i = 0; i < radii.length; i++)
	{
		var x = Math.random();
		if(x > 0.0) // 50% chance of a planet in each orbit
		{
			var planet = new Planet(textures[Math.floor(Math.random()*textures.length)], "clouds.png", -8, 0, -20, 1, radii[i], this);
			planet.orbitVelocity = 0.003 / planet.orbitRadius;
			this.planets.push(planet);
		}
	}
	
	this.miners; // number of miners in the system
}
Star.prototype = new GameObject();
