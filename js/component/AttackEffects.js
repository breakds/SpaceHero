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


var FlameAttackAnimation = function( attacker, victim ) {
    this.objs = new Array();
    this.objs.push( attacker );
    this.objs.push( victim );
    this.lifetime = 80;

    var atkXY = batMapView.getXYFromUV( attacker.u, attacker.v );
    var vicXY = batMapView.getXYFromUV( victim.u, victim.v );
    var dx = vicXY.x - atkXY.x;
    var dy = vicXY.y - atkXY.y;
    
    if ( this.objs[0].leader == logic.battle.commander0 ) {
	this.objs[0].setRotation( Math.atan2( dy, dx ) );
    } else {
	this.objs[0].setRotation( Math.atan2( dy, dx ) + Math.PI );
    }
    this.flame = new MovieClip( "flame", 30, 60, 80, battlefield, ctx2d[1] );
    this.flame.setPos( atkXY.x + dx * 0.5, atkXY.y + dy * 0.5 );
    this.flame.setCenter( 15, 10 );
    this.flame.setRotation( Math.atan2( dy, dx ) - Math.PI * 0.5 );
    this.flame.setIntv( 2 );
    this.flame.setScale( 2.0 );
    logic.battle.onAnimation = true;
    this.onTerminate = function() {
	this.flame.removeInstance();
	this.objs[0].setRotation( 0 );
	new UnitAttackAnimation( this.objs[0], this.objs[1] );
	var u = this.objs[1].u + ( this.objs[1].u - this.objs[0].u );
	var v = this.objs[1].v + ( this.objs[1].v - this.objs[0].v );
	if ( batMap.inMap( u, v ) ) {
	    var obj = batMap.getMap( u ,v );
	    if ( 0 != obj && obj.leader != this.objs[0].leader ) {
		new UnitAttackAnimation( this.objs[0], obj, true );
	    }
	}

    }
    this.init();
}
FlameAttackAnimation.prototype = new Tween;


var Ring = function( x, y ) {
    this.views = new Array();
    this.x = x;
    this.y = y;
    this.radius = 2;
    this.tick = 0;
    this.update = function() {
	this.tick++;
	if ( 0 == this.tick % 2 ) {
	    this.radius += 2;
	    this.requestUpdate();
	}
    }
    this.init();
}
Ring.prototype = new GameObject;

var RingView = function( m ) {
    this.setModel( m );
    this.register( battlefield );
    this.draw = function( ctx ) {
	if ( ctx == ctx2d[1] ) {
	    ctx.strokeStyle = "#FFFFFF";
	    ctx.lineWidth = 2.0;
	    ctx.beginPath();
	    ctx.arc( this.model.x, this.model.y, this.model.radius, 
		     0, Math.PI * 2 );
	    ctx.closePath();
	    ctx.stroke();
	}
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctx2d[1] } );	
    }
    this.requestUpdate();
}
RingView.prototype = new View;



var SurroundingAttackAnimation = function( attacker ) {
    this.attacker = attacker;
    var u = 0;
    var v = 0;
    this.rings = new Array();
    this.ringViews = new Array();
    this.victims = new Array();
    for ( var j=0; j<6; j++ ) {
	u = this.attacker.u + batMap.du[j];
	v = this.attacker.v + batMap.dv[j];
	if ( batMap.inMap( u, v ) ) {
	    var xy = batMapView.getXYFromUV( u, v );
	    this.rings.push( new Ring( xy.x, xy.y ) );
	    this.ringViews.push( new RingView( this.rings[this.rings.length-1] ) );
	    var obj = batMap.getMap( u, v );
	    if ( 0 != obj && obj.leader != this.attacker.leader ) {
		this.victims.push( obj );
	    }
	}
    }
    this.lifetime = 30;
    logic.battle.onAnimation = true;
    this.onTerminate = function() {
	for ( var i=0; i<this.rings.length; i++ ) {
	    this.rings[i].removeInstance();
	    this.rings[i] = null;
	    this.ringViews[i] = null;
	}
	new UnitAttackAnimation( this.attacker, this.victims[0] );
	for ( var i=1; i<this.victims.length; i++ ) {
	    new UnitAttackAnimation( this.attacker, this.victims[i], true );
	}
    }
    this.init();
}
SurroundingAttackAnimation.prototype = new Tween;


var Laser = function( sx, sy ) {
    this.views = new Array();
    this.sx = sx;
    this.sy = sy;
    this.x = 0;
    this.y = 0;
    this.color = "rgb(255,255,255)";
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
    this.init();
}
Laser.prototype = new GameObject;

var LaserView = function( m ) {
    this.setModel( m );
    this.register( battlefield );
    this.draw = function( ctx ) {
	if ( ctx == ctx2d[1] ) {
	    ctx.strokeStyle = this.model.color;
	    ctx.lineWidth = 3;
	    ctx.beginPath();
	    ctx.moveTo( this.model.sx, this.model.sy );
	    ctx.lineTo( this.model.x, this.model.y );
	    ctx.closePath();
	    ctx.stroke();
	}
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctx2d[1] } );	
    }
}
LaserView.prototype = new View;

var LaserAttackAnimation = function( attacker, victim ) {
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
    this.lifetime = 2 * frames;
    this.color = 255;
    this.laser = new Laser( atkXY.x, atkXY.y );
    this.laser.setPos( atkXY.x, atkXY.y );
    this.laserView = new LaserView( this.laser );    
    
    logic.battle.onAnimation = true;
    this.next = function() {
	if ( 0 == this.tick % 2 ) {
	    this.color -= 15;
	    this.laser.color = "rgb(" + 255 + "," + 
		this.color + "," + this.color + ")";
	    this.laser.shift( this.vx, this.vy );
	}
    }

    this.onTerminate = function() {
	this.laser.removeInstance();
	this.laser = null;
	this.laserView = null;
	new UnitAttackAnimation( this.objs[0], this.objs[1] );
    }
    this.init();
}
LaserAttackAnimation.prototype = new Tween;


var MeleeAttackAnimation = function( attacker, victim ) {
    this.objs = new Array();
    this.objs.push( attacker );
    this.objs.push( victim );
    this.lifetime = 50;

    var atkXY = batMapView.getXYFromUV( attacker.u, attacker.v );
    var vicXY = batMapView.getXYFromUV( victim.u, victim.v );
    this.dx = vicXY.x - atkXY.x;
    this.dy = vicXY.y - atkXY.y;
    
    if ( this.objs[0].leader == logic.battle.commander0 ) {
	this.objs[0].setRotation( Math.atan2( this.dy, this.dx ) );
    } else {
	this.objs[0].setRotation( Math.atan2( this.dy, this.dx ) + Math.PI );
    }
    logic.battle.onAnimation = true;
    
    this.next = function() {
	if ( 20 == this.tick ) {
	    this.objs[0].setOffset( - this.dx * 0.3, -this.dy * 0.3 );
	} else if ( 40 == this.tick ) {
	    this.objs[0].setOffset( 0, 0 );
	}
    }
    this.onTerminate = function() {
	this.objs[0].setRotation( 0 );
	new UnitAttackAnimation( this.objs[0], this.objs[1] );
    }
    this.init();
}
MeleeAttackAnimation.prototype = new Tween;