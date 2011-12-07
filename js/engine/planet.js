var PlanetView = function( m ) {
    this.setModel( m );
    /// Do register a view on stage !!!
    this.register( solarSystem );
    
    this.draw = function() {
		this.model.planetModel.update();
		this.model.planetModel.draw();
		if (this.model.hasAtmos) {
			this.model.atmosModel.update();
			this.model.atmosModel.draw();
		}
    }
}
PlanetView.prototype = new View();


var Planet = function(pTexture, aTexture, x, y, z, radius)
{
	this.position = vec3.create();
	this.position[0] = x;
	this.position[1] = y;
	this.position[2] = z;
    this.radius = radius;
	this.hasAtmos = false;
	this.radius = radius;
	this.planetModel = new Model("ball.obj", pTexture);
	this.planetModel.setPosition(x,y,z);
	this.planetModel.setScale(radius,radius,radius);
	this.planetModel.constantRotation(0,-0.4,0);
	if (aTexture != null) {
		this.hasAtmos = true;
		this.atmosModel = new Model("ball.obj", aTexture);
		this.atmosModel.setPosition(this.x,this.y,this.z);
		this.atmosModel.setScale(radius * 1.1, radius * 1.1, radius * 1.1);
		this.atmosModel.constantRotation(0,-0.7,0);
	}

    /// Add a View:
    this.addView( new PlanetView( this ) );
    /// do init a game object before using it
    this.init();
	
	this.orbitAround; // set this equal to the star around which the planet orbits
	this.orbitPosition = Math.random() * Math.PI * 2; // start the planet at a random point around the star
    this.update = function()
	{
		if(this.orbitAround)
		{
			this.position[0] = this.orbitAround.position[0] - this.orbitRadius * Math.sin(this.orbitPosition);
			this.position[1] = this.orbitAround.position[1];
			this.position[2] = this.orbitAround.position[2] + this.orbitRadius * Math.cos(this.orbitPosition);
			this.planetModel.setPosition(this.position[0],this.position[1],this.position[2]);
			this.orbitPosition += this.orbitVelocity;
			if(this.hasAtmos)
			{
				this.atmosModel.setPosition(this.position[0],this.position[1],this.position[2]);
			}
		}
    }
}
Planet.prototype = new GameObject();