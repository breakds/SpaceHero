var Missile = function() {
    this.views = new Array();
    this.frame = 0;
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.tick = 0;
    this.setPos = function( x, y ) {
	this.x = x;
	this.y = y;
	this.requestUpdate();
    }
    this.shift = function( dx, dy ) {
	this.x += dx;
	this.y += dy;
	this.requestUpdate();
    }
    this.setAngle = function( ang ) {
	this.rotation = ang;
	this.requestUpdate();
    }
    this.update = function() {
	this.tick++;
	if ( this.tick >= 5 ) {
	    this.tick = 0;
	    this.frame++;
	    if ( this.frame>=24 ) {
		this.frame = 0;
	    }
	    this.requestUpdate();
	}
    }
    this.init();

}
Missile.prototype = new GameObject;

var MissileView = function( m ) {
    this.setModel( m );
    this.register( battlefield );
    this.draw = function( ctx ) {
	if ( ctx == ctx2d[1] ) {
	    drawRotatedImage( ctx2d[1],
			      resources.getResource(
				  "missile"+this.model.frame+"Anim" ),
			      this.model.rotation,
			      this.model.x,
			      this.model.y,
			      15,
			      75,
			      true );
	}
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctx2d[1] } );	
    }
}
MissileView.prototype = new View;

var MissileAttackAnimation = function( attacker, victim ) {
    this.objs = new Array();
    this.objs.push( attacker );
    this.objs.push( victim );
    var atkXY = batMapView.getXYFromUV( attacker.u, attacker.v );
    var vicXY = batMapView.getXYFromUV( victim.u, victim.v );
    var dx = vicXY.x - atkXY.x;
    var dy = vicXY.y - atkXY.y;
    var dist = Math.sqrt( dx * dx + dy * dy );
    var frames = Math.floor( dist / 50.0 );
    this.vx = dx / frames;
    this.vy = dy / frames;
    this.lifetime = 5 * frames;
    
    this.missile = new Missile();
    this.missile.setPos( atkXY.x, atkXY.y );

    this.missile.setAngle( Math.PI * 0.5 + Math.atan2( dy, dx ) );
    this.missileView = new MissileView( this.missile );    
    
    logic.battle.onAnimation = true;
    this.next = function() {
	if ( 0 == this.tick % 5 ) {
	    this.missile.shift( this.vx, this.vy );
	}
    }

    this.onTerminate = function() {
	this.missile.removeInstance();
	this.missile = null;
	this.missileView = null;
	new UnitAttackAnimation( this.objs[0], this.objs[1] );
    }
    this.init();
}
MissileAttackAnimation.prototype = new Tween;