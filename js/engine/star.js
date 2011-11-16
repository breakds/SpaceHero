var StarView = function( m ) {
    this.setModel( m );
	this.that = this;
    /// Do register a view on stage !!!
    this.register( battleField );
    
    this.draw = function() {
		//lightPos = [this.model.x, this.model.y, this.model.z];
		this.model.starModel.draw();
    }
	
}
StarView.prototype = new View();


var Star = function(texture, x, y, z, radius) {
    this.x = x;
    this.y = y;
	this.z = z;
    this.radius = radius;
	this.starModel = new Model("ball.obj", texture);
	
	this.starModel.setPosition(this.x, this.y, this.z);
	this.starModel.setScale(this.radius, this.radius, this.radius);
	this.starModel.useLighting(false);

    /// Add a View:
    this.addView( new StarView( this ) );
	
    /// do init a game object before using it
    this.init();
    this.update = function() {
	
	
    }
}
Star.prototype = new GameObject();