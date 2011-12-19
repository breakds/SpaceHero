var Bubble = function( msg, textfield, stage, x, y, width, height ) {
    this.views = new Array();
    this.width = width;
    this.height = height;
    this.stage = stage;
    this.x = x - this.width * 0.5;
    this.y = y - this.height;
    this.view = new BubbleView( this );
    this.msg = document.createTextNode( msg );
    this.textfield = $(textfield);
    this.textfield.appendChild( this.msg );
    this.textfield.style.width = (this.width - 8) + "px";
    this.textfield.style.height = (this.height - 4) + "px";
    this.textfield.style.left = ( this.x + 4 ) + "px";
    this.textfield.style.top = ( this.y + 2 ) + "px";
    this.destroy = function() {
	this.textfield.removeChild( this.msg );
	this.textfield.style.width = "0px";
	this.textfield.style.height = "0px";
	this.removeInstance();
    }
    this.init();
}
Bubble.prototype = new GameObject;

var BubbleView = function( m ) {
    this.setModel( m );
    this.register( m.stage );
    this.gradients = ctxMenu.createLinearGradient( m.x, m.y, m.x, m.y + m.height );
    this.gradients.addColorStop( 0, "#666666" );
    this.gradients.addColorStop( 1, "#222222" );
    this.draw = function( ctx ) {
	if ( ctx == ctxMenu ) {
	    ctx.lineWidth = 3;
	    ctx.strokeStyle = "#222222";
	    ctx.fillStyle = this.gradients;
	    ctx.roundRect( this.model.x,
			   this.model.y,
			   this.model.width,
			   this.model.height,
			   8,
			   true,
			   true );
	}
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
    }
    this.requestUpdate();
}
BubbleView.prototype = new View();

var TimedBubble = function( bubble, time ) {
    this.bubble = bubble;
    this.lifetime = time;
    this.tick = 0;
    logic.status.onAnimation++;
    this.onTerminate = function() {
	logic.status.onAnimation--;
	this.bubble.destroy();
    }
    this.init();
}
TimedBubble.prototype = new Tween();