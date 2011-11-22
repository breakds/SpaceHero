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


var Planet = function(pTexture, aTexture, x, y, z, radius) {
    this.x = 0;
    this.y = 0;
	this.z = -10;
    this.radius = 1.5;
	this.hasAtmos = false;
	this.radius = radius;
	this.planetModel = new Model("ball.obj", pTexture);
	this.planetModel.setPosition(x,y,z);
	this.planetModel.setScale(radius,radius,radius);
	this.planetModel.constantRotation(0,0.07,0);
	if (aTexture != null) {
		this.hasAtmos = true;
		this.atmosModel = new Model("ball.obj", aTexture);
		this.atmosModel.setPosition(x,y,z);
		this.atmosModel.setScale(radius * 1.1, radius * 1.1, radius * 1.1);
		this.atmosModel.constantRotation(0,0.2,0);
	}

    /// Add a View:
    this.addView( new PlanetView( this ) );
    /// do init a game object before using it
    this.init();
    this.update = function() {
	
	
    }
}
Planet.prototype = new GameObject();
