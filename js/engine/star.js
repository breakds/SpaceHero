var StarView = function( m ) {
    this.setModel( m );
	this.that = this;
    /// Do register a view on stage !!!
    this.register( solarSystem );
    
    this.draw = function() {
		//lightPos = [this.model.x, this.model.y, this.model.z];
		this.model.starModel.draw();
    }
	
}
StarView.prototype = new View();


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

    /// Add a View:
    this.addView( new StarView( this ) );
	
    /// do init a game object before using it
    this.init();
    this.update = function()
	{
    }
}
Star.prototype = new GameObject();