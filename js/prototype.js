/// Create a Stage
var battleField = new Stage();

/// Set Current Rendering Stage
game.setStage( battleField );


/// Create class SquareView inheriting View
var SquareView = function( m ) {
    this.setModel( m );

    /// Do register a view on stage !!!
    this.register( battleField );
    
    this.draw = function() {
	c2d.fillStyle = "#FF0000";
	c2d.beginPath();
	c2d.moveTo( this.model.x, this.model.y );
	c2d.lineTo( this.model.x + this.model.size, 
		    this.model.y );
	c2d.lineTo( this.model.x + this.model.size, 
		    this.model.y + this.model.size);
	c2d.lineTo( this.model.x,
		    this.model.y + this.model.size );
	c2d.lineTo( this.model.x, this.model.y );
	c2d.closePath();
	c2d.fill();
    }
}
SquareView.prototype = new View();


/// Create class Square inheriting GameObjects
var Square = function() {
    this.x = 210;
    this.y = 0;
    this.size = 10;
    this.velocity = 10;


    /// Add a View:
    this.addView( new SquareView( this ) );
    /// do init a game object before using it
    this.init();
    this.update = function() {
	if ( this.x > 400 || this.x < 200) {
	    this.velocity = -this.velocity;
	}
	this.x += this.velocity;
	/// Event Test
	if ( Math.abs(this.x - 300) < 21 ) {
	    dispatcher.broadcast( { name: "TestEvent" } );
	}
    }
    this.onTestEvent = function() {
	//trace( "hey!" );
    }
    dispatcher.addListener( "TestEvent", this );
}
Square.prototype = new GameObject();

var square = new Square();
var square = new Square();

var testStar = new Star("star1.png", 0, 0, -20, 2);
var testPlanet = new Planet("testPlanet.png", "clouds.png", -8, 0, -20, 1);
game.play();