var BattleHexagonView = function( m, radius ) {
    this.setModel( m );
    this.register( battlefield );
    
    
    /*
     * In this view, the map is rotated 90 degree, so cols will serve 
     * as rows, and the same goes for rows
     */
    
    this.left = 100;
    this.top = 250;
    
    this.radius = radius;

    this.boundBox = { ymin: this.top - this.radius,
		      ymax: this.top + this.radius * ( 1.5 * this.model.cols - 0.5 ),
		      xmin: this.left - this.radius * Math.sqrt(3) * 0.5,
		      xmax: this.left + this.radius * Math.sqrt(3) * ( this.model.rows + 1 )
		    };
    

    var smallerRadius = this.radius * Math.sqrt(3) * 0.5;
    this.dx = [ - smallerRadius * 2,
		-smallerRadius,
		smallerRadius,
		smallerRadius * 2,
		smallerRadius,
		- smallerRadius ];




    this.dy = [ 0, 
		this.radius * 1.5,
		this.radius * 1.5,
		0,
		-this.radius * 1.5,
		-this.radius * 1.5 ];



    
    this.mouseOn = { u: -1, v: -1, x:0, y:0 };
    this.getUVFromXY = function( x, y )
    {
	var smallerRadius = this.radius * Math.sqrt(3) * 0.5;
	var deltaX = x - this.left;
	var deltaY = y - this.top;
	var v = Math.ceil( deltaX / smallerRadius );
	var u = Math.round( deltaY / (1.5 * this.radius) );
	v -= (( v & 1 ) ^ ( this.model.lower[u] & 1 ) );
	if ( this.model.inMap( u, v ) )
	{
	    return {u:u,v:v};
	}
	else
	{
	    return {u:-1,v:-1};
	}
    }


    this.getXYFromUV = function( u, v ) {
	return  { y: this.radius * 1.5 * u + this.top, 
		  x: this.radius * Math.sqrt(3) * 0.5 * v + this.left };
    }

    this.drawHexagon = function( x, y )
    {
	var ang = -Math.PI * 0.5;
	var step = Math.PI / 3.0;
	ctxBg2d.moveTo(x, y - this.radius);
	for ( var i=0; i<6; i++ )
	{
	    ang += step;
	    ctxBg2d.lineTo( x + this.radius * Math.cos( ang ), y + this.radius * Math.sin( ang ) );
	}
    }

    
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxBg2d } );
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctx2d[1] } );
    }

    this.requestUpdate();

    this.draw = function( ctx ) {
	if ( ctx == ctxBg2d ) {
	    var x = this.left;
	    var y = this.top;
	    var smallerRadius = this.radius * Math.sqrt(3) * 0.5;
	    
	    ctxBg2d.strokeStyle = "#0000FF"
	    ctxBg2d.beginPath();
	    for ( var u=0; u<this.model.cols; u++ ) 
	    {
		x = this.left + this.model.lower[u] * smallerRadius;
		for ( var v=this.model.lower[u]; v<=this.model.upper[u]; v+=2 )
		{
		    this.drawHexagon( x, y );
		    x += smallerRadius * 2;
		}
		y += this.radius * 1.5;
	    }
	    ctxBg2d.closePath();
	    ctxBg2d.stroke();

	    
	    /// Draw Reachable
	    if ( null != logic.battle.reachable ) {
		ctxBg2d.fillStyle = "#223366";
		ctxBg2d.strokeStyle = "#0000FF"
		ctxBg2d.beginPath();
		var c = null;
		for ( var i=0; i<logic.battle.reachable.length; i++ ) {
		    c = this.getXYFromUV( logic.battle.reachable[i].u,
					  logic.battle.reachable[i].v );
		    this.drawHexagon( c.x, c.y );
		}
		ctxBg2d.closePath();
		ctxBg2d.fill();
		ctxBg2d.stroke();
	    }


	    /// Draw Attackable
	    if ( null != logic.battle.reachable ) {
		ctxBg2d.fillStyle = "#AA0000";
		ctxBg2d.strokeStyle = "#0000FF"
		ctxBg2d.beginPath();
		var c = null;
		for ( var i=0; i<logic.battle.attackable.length; i++ ) {
		    c = this.getXYFromUV( logic.battle.attackable[i].u,
					  logic.battle.attackable[i].v );
		    this.drawHexagon( c.x, c.y );
		}
		ctxBg2d.closePath();
		ctxBg2d.fill();
		ctxBg2d.stroke();
	    }

	    // Draw MouseOn
	    if ( -1 != this.mouseOn.u ) {
		ctxBg2d.strokeStyle = "#FFFF00";
		c = this.getXYFromUV( this.mouseOn.u,
				      this.mouseOn.v );
		this.drawHexagon( c.x, c.y );
		ctxBg2d.closePath();
		ctxBg2d.stroke();
	    }
	} else if ( ctx == ctx2d[1] ) {
	    var flag = false;
	    for ( var i=0; i<logic.battle.attackable.length; i++ ) {
		if ( logic.battle.attackable[i].u == this.mouseOn.u &&
		     logic.battle.attackable[i].v == this.mouseOn.v ) {
		    flag = true;
		    break;
		}
	    }
	    var obj = logic.battle.units[logic.battle.currentUnitID];

	    if ( flag && 0 == obj.leader.group && 
		 (!obj.template.archer) ) {
		var c = this.getXYFromUV( this.mouseOn.u,
					  this.mouseOn.v );
		var px = this.mouseOn.x - c.x;
		var py = this.mouseOn.y - c.y;
		var i = 0;
		var ang = Math.atan2( py, px );
		if ( ang > - Math.PI * 5 / 6 &&
		     ang < Math.PI *5 / 6 ) {
		    i = 5 - Math.floor( ( ang + Math.PI * 5 / 6 ) / Math.PI * 3 );
		}
		var tarU = this.mouseOn.u + batMap.du[i];
		var tarV = this.mouseOn.v + batMap.dv[i];
		
		/// Check Reachable
		flag = false;
		for ( var j=0; j<logic.battle.reachable.length; j++ ) {
		    if ( logic.battle.reachable[j].u == tarU &&
			 logic.battle.reachable[j].v == tarV ) {
			logic.battle.destination = j;
			flag = true;
		    }
		}
		
		if ( flag ) {
		    drawRotatedImage( ctx2d[1],
				      resources.getResource( "attackIcon" ),
				      Math.atan2( this.dy[i], this.dx[i] ) + Math.PI * 0.5,
				      c.x + this.dx[i] * 0.5,
				      c.y + this.dy[i] * 0.5,
				      36,
				      65,
				      true );
		} else {
		    logic.battle.destination = -1;
		}
	    }
	} 
    }




    this.hitTest = function( x, y ) {
	if ( x < this.boundBox.xmin ||
	     x > this.boundBox.xmax ||
	     y < this.boundBox.ymin ||
	     y > this.boundBox.ymax ) {
	    return false;
	}
	return true;
    }

    
    this.onMouseMove = function( x, y ) {
	var uv = this.getUVFromXY( x, y );
	if ( this.model.inMap( uv.u, uv.v ) ) {
	    this.mouseOn.u = uv.u;
	    this.mouseOn.v = uv.v;
	    this.mouseOn.x = x;
	    this.mouseOn.y = y;
	    this.requestUpdate();
	    
	    /// Update the BattleUnit Panel
	    var obj = this.model.getMap( uv.u, uv.v );
	    if ( 0 != obj ) {
		if ( logic.battle.commander0 == obj.leader ) {
		    logic.battle.leftUnitShown = obj;
		} else if ( logic.battle.commander1 == obj.leader ) {
		    logic.battle.rightUnitShown = obj;
		}
	    }
	    logic.battle.leftPanel.requestUpdate();
	}
    }

    
    this.onLeftMouseDown = function( x, y ) {
	var obj = logic.battle.units[logic.battle.currentUnitID];
	if ( 0 == obj.leader.group ) {
	    var uv = this.getUVFromXY( x, y );
	    dispatcher.broadcast( { name: "UnitMove",
				    obj: obj,
				    u: uv.u,
				    v: uv.v } );
	}
    }
}
BattleHexagonView.prototype = new View;



var BattleUnitView = function( unit, side ) {
    this.setModel( unit );
    this.register( battlefield );


    this.side = side;
    if ( 0 == this.side ) {
	this.rotation = Math.PI * 0.5;
    } else {
	this.rotation = -Math.PI * 0.5;
    }
    
    this.draw = function( ctx ) {
	if ( ctx == ctx2d[0] ) {
	    if ( !this.model.active ) {
		return ;
	    }
	    c = batMapView.getXYFromUV( this.model.u, this.model.v );
	    var size = batMapView.radius * 1.90;
	    c.x += this.model.offset.x;
	    c.y += this.model.offset.y
	    drawRotatedImage( ctx2d[0],
			      this.model.template.image,
			      this.rotation + this.model.rotation,
			      c.x,
			      c.y,
			      size,
			      size,
			      true );

	    
	    
	    if ( this.model.leader == logic.battle.commander0 ) {
		ctx2d[0].fillStyle = "#AA00AA";
	    } else {
		ctx2d[0].fillStyle = "#EE2200";
	    }
	    ctx2d[0].fillRect( c.x - batMapView.radius * 0.8,
			       c.y + batMapView.radius * 0.8,
			       batMapView.radius * 0.8,
			       batMapView.radius * 0.4 );
	    ctx2d[0].strokeStyle = "#FFFFFF";
	    ctx2d[0].strokeRect( c.x - batMapView.radius * 0.8,
				 c.y + batMapView.radius * 0.8,
				 batMapView.radius * 0.8,
				 batMapView.radius * 0.4 );

	    ctx2d[0].fillStyle = "#FFFFFF";
	    ctx2d[0].font = "10px Arial";
	    ctx2d[0].textBaseline = "top";
	    ctx2d[0].textAlign = "center";
	    ctx2d[0].fillText( this.model.quantity, 
			       c.x - batMapView.radius * 0.4,
			       c.y + batMapView.radius * 0.82 );
	}
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctx2d[0] } );
    }
    this.requestUpdate();
}
BattleUnitView.prototype = new View;



/// The status bar on the left/right of Battle Stage
var BattleCommanderView = function( cmder, align ) {
    this.setModel( cmder );
    this.register( battlefield );
    this.width = 375.0;
    this.height = 185.0;
    this.scale = 0.6;
    this.align = align;
    
    if ( "left" == this.align ) {
	this.left = 5;
	this.top = 5;
    } else if ( "right" == this.align ) {
	this.right = GameScreen.width - 5;
	this.top = 5;
    }
    this.drawAttackIcon = function( x, y, size ) {
	ctxMenu.strokeStyle = "#FFFFFF";
	ctxMenu.beginPath();
	ctxMenu.moveTo( x, y );
	ctxMenu.lineTo( x + size, y + size );
	ctxMenu.moveTo( x + size, y );
	ctxMenu.lineTo( x, y + size );
	ctxMenu.moveTo( x, y + 0.8 * size );
	ctxMenu.lineTo( x + 0.2 * size, y + size);
	ctxMenu.moveTo( x + size, y + 0.8 * size );
	ctxMenu.lineTo( x + 0.8 * size , y + size );
	ctxMenu.closePath();
	ctxMenu.stroke();
    }
    this.drawDefenceIcon = function( x, y, size ) {
	ctxMenu.strokeStyle = "#FFFFFF";
	ctxMenu.beginPath();
	ctxMenu.moveTo( x + 0.1 * size, y + 0.8 * size );
	ctxMenu.lineTo( x + 0.1 * size, y );
	ctxMenu.lineTo( x + 0.9 * size, y );
	ctxMenu.lineTo( x + 0.9 * size, y + 0.8 * size );
	ctxMenu.lineTo( x + 0.5 * size, y + size );
	ctxMenu.closePath();
	ctxMenu.stroke();
    }
    this.draw = function( ctx ) {
	if ( ctx == ctxMenu ) {
	    if ( "left" == this.align ) {
		ctxMenu.drawImage( resources.getResource( "panelBgImg" ),
				   this.left,
				   this.top,
				   this.width * this.scale,
				   this.height * this.scale );

		/// Draw Portrait
		ctxMenu.lineWidth = 1;
		ctxMenu.strokeStyle = "#FFFFFF";
		ctxMenu.strokeRect( this.left + 5, this.top + 15, 40, 40 );
		ctxMenu.fillStyle = "#FF0000";
		ctxMenu.fillRect( this.left + 5, this.top + 15, 40, 40 );


		/// Draw Attack and Defense
		this.drawAttackIcon( this.left + 50, this.top + 17, 15 );
		this.drawDefenceIcon( this.left + 50, this.top + 37, 15 );
		this.drawDefenceIcon( this.left + 53, this.top + 40, 9 );
		ctxMenu.fillStyle = "#FFFFFF";
		ctxMenu.textAlign = "left";
		ctxMenu.textBaseline = "top";
		ctxMenu.font = "15px Arial"
		ctxMenu.fillText( this.model.att,
				  this.left + 70,
				  this.top + 17 );
		ctxMenu.fillText( this.model.def,
				  this.left + 70,
				  this.top + 37 );


		/// Draw Name
		ctxMenu.fillStyle = "#FFFF00";
		ctxMenu.textAlign = "center";
		ctxMenu.textBaseline = "top";
		ctxMenu.font = "15px Arial"
		ctxMenu.fillText( this.model.name,
				  this.left + 45,
				  this.top + 80 );
		
		if ( null != logic.battle.leftUnitShown ) {
		    var unit = logic.battle.leftUnitShown;
		    ctxMenu.drawImage( unit.template.image,
				       this.left+ 180, 
				       this.top + 25,
				       40,
				       40 );

		    /// Att
		    ctxMenu.fillStyle = "#FF0000";
		    ctxMenu.textAlign = "left";
		    ctxMenu.textBaseline = "top";
		    ctxMenu.font = "10px Arial"
		    ctxMenu.fillText( "Attack",
				      this.left + 105,
				      this.top + 20 - 2 );
		    ctxMenu.fillText( "Defense",
				      this.left + 105,
				      this.top + 35 - 2 );
		    ctxMenu.fillText( "Damage",
				      this.left + 105,
				      this.top + 50 - 2 );
		    ctxMenu.fillText( "Speed",
				      this.left + 105,
				      this.top + 65 - 2 );
		    ctxMenu.fillText( "Archer",
				      this.left + 105,
				      this.top + 80 - 2 );

		    ctxMenu.fillStyle = "#FFFFFF";
		    ctxMenu.textAlign = "left";
		    ctxMenu.textBaseline = "top";
		    ctxMenu.font = "10px Arial"
		    ctxMenu.fillText( unit.template.att+"+"+this.model.att,
				      this.left + 152,
				      this.top + 20 - 2 );
		    ctxMenu.fillText( unit.template.def+"+"+this.model.def,
				      this.left + 152,
				      this.top + 35 - 2 );
		    ctxMenu.fillText( unit.template.dmgMin+"-"+unit.template.dmgMax,
				      this.left + 152,
				      this.top + 50 - 2 );
		    ctxMenu.fillText( unit.template.spd,
				      this.left + 152,
				      this.top + 65 - 2 );
		    if ( unit.template.archer ) {
			ctxMenu.fillText( "Yes",
					  this.left + 152,
					  this.top + 80 - 2 );
		    } else {
			ctxMenu.fillText( "No",
					  this.left + 152,
					  this.top + 80 - 2 );
		    }
		    

		    /// Draw HP Bar
		    if ( unit.curHp * 3 > unit.template.hp ) {
			ctxMenu.fillStyle = "#00AA00";
			ctxMenu.fillRect( this.left + 180,
					  this.top + 70,
					  30.0 * unit.curHp / unit.template.hp,
					  10 );
		    } else {
			ctxMenu.fillStyle = "#AA0000";
			ctxMenu.fillRect( this.left + 180,
					  this.top + 70,
					  30.0 * unit.curHp / unit.template.hp,
					  10 );
		    }
		    ctxMenu.fillStyle = "#FFFFFF";
		    ctxMenu.textAlign = "center";
		    ctxMenu.textBaseline = "top";
		    ctxMenu.font = "10px Arial"
		    ctxMenu.fillText( unit.curHp + "/" + unit.template.hp,
				      this.left + 195,
				      this.top + 70 );
		} 
	    } else if ( "right" == this.align ) {
		ctxMenu.drawImage( resources.getResource( "panelBgRightImg" ),
				   this.right - this.width * this.scale,
				   this.top,
				   this.width * this.scale,
				   this.height * this.scale );

		/// Draw Portrait
		ctxMenu.lineWidth = 1;
		ctxMenu.strokeStyle = "#FFFFFF";
		ctxMenu.strokeRect( this.right - 45, this.top + 15, 40, 40 );
		ctxMenu.fillStyle = "#FF0000";
		ctxMenu.fillRect( this.right - 45, this.top + 15, 40, 40 );


		/// Draw Attack and Defense
		this.drawAttackIcon( this.right - 50 - 15, this.top + 17, 15 );
		this.drawDefenceIcon( this.right - 50 - 15, this.top + 37, 15 );
		this.drawDefenceIcon( this.right - 53 - 9, this.top + 40, 9 );
		ctxMenu.fillStyle = "#FFFFFF";
		ctxMenu.textAlign = "right";
		ctxMenu.textBaseline = "top";
		ctxMenu.font = "15px Arial"
		ctxMenu.fillText( this.model.att,
				  this.right - 70,
				  this.top + 17 );
		ctxMenu.fillText( this.model.def,
				  this.right - 70,
				  this.top + 37 );


		/// Draw Name
		ctxMenu.fillStyle = "#FFFF00";
		ctxMenu.textAlign = "center";
		ctxMenu.textBaseline = "top";
		ctxMenu.font = "15px Arial"
		ctxMenu.fillText( this.model.name,
				  this.right - 47,
				  this.top + 80 );
		
		if ( null != logic.battle.rightUnitShown ) {
		    var unit = logic.battle.rightUnitShown;
		    ctxMenu.drawImage( unit.template.image,
				       this.right - 180 - 40, 
				       this.top + 25,
				       40,
				       40 );

		    /// Att
		    ctxMenu.fillStyle = "#FF0000";
		    ctxMenu.textAlign = "right";
		    ctxMenu.textBaseline = "top";
		    ctxMenu.font = "10px Arial"
		    ctxMenu.fillText( "Attack",
				      this.right - 105,
				      this.top + 20 - 2 );
		    ctxMenu.fillText( "Defense",
				      this.right - 105,
				      this.top + 35 - 2 );
		    ctxMenu.fillText( "Damage",
				      this.right - 105,
				      this.top + 50 - 2 );
		    ctxMenu.fillText( "Speed",
				      this.right - 105,
				      this.top + 65 - 2 );
		    ctxMenu.fillText( "Archer",
				      this.right - 105,
				      this.top + 80 - 2 );

		    ctxMenu.fillStyle = "#FFFFFF";
		    ctxMenu.textAlign = "right";
		    ctxMenu.textBaseline = "top";
		    ctxMenu.font = "10px Arial"
		    ctxMenu.fillText( unit.template.att+"+"+this.model.att,
				      this.right - 152,
				      this.top + 20 - 2 );
		    ctxMenu.fillText( unit.template.def+"+"+this.model.def,
				      this.right - 152,
				      this.top + 35 - 2 );
		    ctxMenu.fillText( unit.template.dmgMin+"-"+unit.template.dmgMax,
				      this.right - 152,
				      this.top + 50 - 2 );
		    ctxMenu.fillText( unit.template.spd,
				      this.right - 152,
				      this.top + 65 - 2 );
		    if ( unit.template.archer ) {
			ctxMenu.fillText( "Yes",
					  this.right - 152,
					  this.top + 80 - 2 );
		    } else {
			ctxMenu.fillText( "No",
					  this.right - 152,
					  this.top + 80 - 2 );
		    }
		    

		    /// Draw HP Bar
		    if ( unit.curHp * 3 > unit.template.hp ) {
			ctxMenu.fillStyle = "#00AA00";
			ctxMenu.fillRect( this.right - 180 - 30,
					  this.top + 70,
					  30.0 * unit.curHp / unit.template.hp,
					  10 );
		    } else {
			ctxMenu.fillStyle = "#AA0000";
			ctxMenu.fillRect( this.right - 180 - 30,
					  this.top + 70,
					  30.0 * unit.curHp / unit.template.hp,
					  10 );
		    }
		    ctxMenu.fillStyle = "#FFFFFF";
		    ctxMenu.textAlign = "center";
		    ctxMenu.textBaseline = "top";
		    ctxMenu.font = "10px Arial"
		    ctxMenu.fillText( unit.curHp + "/" + unit.template.hp,
				      this.right - 195,
				      this.top + 70 );
		}
		
	    }
	}
    }
    this.requestUpdate = function() {
	this.requestUpdate = function() {
	    dispatcher.broadcast( { name: "UpdateContext",
				    ctx: ctxMenu } );
	}
    }
    this.requestUpdate();
}
BattleCommanderView.prototype = new View;




/// Ad Hoc Tweens
var UnitMoveAnimation = function( obj, path, victim ) {
    this.objs = new Array();
    this.objs.push( obj );
    this.path = path;
    this.lifetime = this.path.length * 20;
    this.victim = victim
    this.onStart = function() {
	logic.battle.onAnimation = true;
    }
    this.next = function() {
	if ( 0 == this.tick % 20 ) {
	    this.objs[0].setOffset( 0, 0 );
	    this.objs[0].setPos( path[path.length-1].u,
				 path[path.length-1].v );
	    this.path.splice( path.length-1, 1 );
	} else if ( 0 == this.tick % 5 ) {
	    for ( var j=0; j<6; j++ ) {
		if ( batMap.du[j] == path[path.length-1].u - this.objs[0].u &&
		     batMap.dv[j] == path[path.length-1].v - this.objs[0].v
		   ) {
		    this.objs[0].setOffset( this.objs[0].offset.x + 
					    batMapView.dx[j] * 0.25,
					    this.objs[0].offset.y + 
					    batMapView.dy[j] * 0.25 );
		    break;
		}
	    }
	}
    }
    this.onTerminate = function() {
	if ( null != this.victim ) {
	    if ( "flame" == this.objs[0].template.attackStyle ) {
		new FlameAttackAnimation( this.objs[0], this.victim );
	    } else if ( "Surrounding" == this.objs[0].template.attackStyle ) { 
		new SurroundingAttackAnimation( this.objs[0] );
	    } else {
		new MeleeAttackAnimation( this.objs[0], this.victim );
	    }
	} else {
	    logic.battle.onAnimation = false;
	    dispatcher.broadcast( { name: "NextUnit" } );
	}
    }
    this.init();
}
UnitMoveAnimation.prototype = new Tween;


var UnitAttackAnimation = function( attacker, victim, extra ) {
    this.objs = new Array();
    this.objs.push( attacker );
    this.objs.push( victim );
    this.shakeOffset = -10;
    this.lifetime = 30;
    this.onStart = function() {
	logic.battle.onAnimation = true;
    }
    this.next = function() {
	if ( 0 == this.tick % 5 ) {
	    this.objs[1].setOffset( this.shakeOffset, 0 );
	    this.shakeOffset = -this.shakeOffset;
	}
	if ( 20 == this.tick ) {
	    /// Attacking
	    var damage = this.objs[1].underAttack( this.objs[0] );
	}
    }
    this.onTerminate = function() {
	/// Cleaning 
	this.objs[1].setOffset( 0, 0 );
	logic.battle.onAnimation = false;
	if ( !extra ) {
	    dispatcher.broadcast( { name: "NextUnit" } );
	}
    }
    this.init();
}
UnitAttackAnimation.prototype = new Tween;

var UnitTurnStartAnimation = function( obj ) {
    this.objs = new Array();
    this.objs.push( obj );
    this.objs[0].selector.setScale( 0.9 );
    this.objs[0].selector.setIntv(1);
    this.scale = 0.9;
    this.lifetime = 30;
    logic.battle.onAnimation = true;
    this.next = function() {
	this.scale -= 0.02;
	this.objs[0].selector.setScale( this.scale );
    }
    this.onTerminate = function() {
	logic.battle.onAnimation = false;
	this.objs[0].selector.setScale( 0.3 );
	this.objs[0].selector.setIntv( 6 );
	if ( 0 != this.objs[0].group ) {
	    dispatcher.broadcast( { name: "AIThinking",
				    obj: this.objs[0] } );
	}
    }
    this.init();
}
UnitTurnStartAnimation.prototype = new Tween;

var BattleReporter = function( logicModel ) {
    this.setModel( logicModel );
    this.register( battlefield );
    this.left = 260;
    this.top = 30;
    this.messages = new Array();
    this.curMsgID = -1;
    this.append = function( msg ) {
	this.messages.push( msg );
	this.curMsgID = this.messages.length - 1;
	this.requestUpdate();
    }
    this.angle = 0;
    this.clear = function() {
	this.messages = new Array();
	this.curMsgID = -1;
    }
    this.draw = function( ctx ) {
	if ( ctxMenu == ctx ) {
	    drawRotatedImage( ctxMenu,
			      resources.getResource( "scanLineImg" ),
			      this.angle,
			      this.left + 81,
			      this.top + 79,
			      76,
			      38
			    );
	    ctxMenu.drawImage( resources.getResource( "statusBgImg" ),
			       this.left,
			       this.top );
	    if ( this.curMsgID > -1 ) {
		ctxMenu.fillStyle = "#FFFFFF";
		ctxMenu.textAlign = "left";
		ctxMenu.textBaseline = "top";
		ctxMenu.font = "12px Arial"
		var y = this.top + 120;
		ctxMenu.fillStyle = "#00AAFF";
		ctxMenu.fillText( this.messages[this.curMsgID],
				  this.left + 176,
				  y );
		ctxMenu.fillStyle = "#FFFFFF";
		for ( var i=1; i<=4; i++ ) {
		    y = y - 20;
		    if ( this.curMsgID - i >= 0 ) {
			ctxMenu.fillText( this.messages[this.curMsgID-i],
					  this.left + 176,
					  y );
		    }
		}

	    }
	}
    }
    this.requestUpdate = function() {
	this.requestUpdate = function() {
	    dispatcher.broadcast( { name: "UpdateContext",
				    ctx: ctxMenu } );
	}
    }
}
BattleReporter.prototype = new View();




var ReporterAnimation = function() {
    this.lifetime = 20;
    this.next = function() {
	if ( game.stage == battlefield ) {
	    if ( 5 == this.tick ) {
		this.tick = 0;
		reporter.angle += Math.PI * 0.02;
		reporter.requestUpdate();
	    }
	} else {
	    this.tick = 0;
	}
    }
    this.init();
}
ReporterAnimation.prototype = new Tween;

/*
var BattleHexagonView = function( m, radius ) {
    this.setModel( m );
    this.register( battlefield );
    this.radius = radius;


    this.sx = -6.0;
    this.sy = -2.7;

    

    this.hexagonVertexBuffers = new Array();


    /// Init ColorBuffer
    var colors = new Array();
    for ( var i=0; i<24; i++ ) {
	colors.push(1.0);
    }
    this.colorBuffer = gl.createBuffer();
    this.colorBuffer.itemSize = 4;
    this.colorBuffer.numItems = 6;
    gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW );

    
    this.addHexagon = function( x, y ) {
	var r = this.radius;
	var ang = 0.0;
	var step = Math.PI / 3.0;
	var vertices = new Array();
	for ( var i=0; i<6; i++ )
	{
	    ang += step;
	    vertices.push( x + r * Math.cos( ang ) );
	    vertices.push( y + r * Math.sin( ang ) );
	    vertices.push( -7 );
	}
	var vertexBuffer = gl.createBuffer();
	vertexBuffer.itemSize = 3;
	vertexBuffer.numItems = 6;
	gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW );
	this.hexagonVertexBuffers.push( vertexBuffer );
    }

    this.initHexagons = function() {
	var x = this.sx;
	var y = this.sy;
	var smallerRadius = this.radius * Math.sqrt(3) * 0.5;
	for ( var u=0; u<this.model.cols; u++ ) {
	    y = this.sy + this.model.lower[u] * smallerRadius;
	    for ( var v=this.model.lower[u]; v<=this.model.upper[u]; v+=2 )
	    {
		this.addHexagon( x, y );
		y += smallerRadius * 2;
	    }
	    x += this.radius * 1.5;
	}

    }
    this.initHexagons();

    
    
    this.draw = function() {
	setShader( notShaderProgram );
	for ( var i=0; i<this.hexagonVertexBuffers.length; i++ ) {
	    gl.bindBuffer( gl.ARRAY_BUFFER, this.hexagonVertexBuffers[i] );
	    gl.vertexAttribPointer( notShaderProgram.vertexPositionAttribute,
				    this.hexagonVertexBuffers[i].itemSize,
				    gl.FLOAT,
				    false,
				    0, 0 );
	    gl.bindBuffer( gl.ARRAY_BUFFER, this.colorBuffer );
	    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW );
	    gl.vertexAttribPointer( notShaderProgram.vertexColorAttribute,
				    this.colorBuffer.itemSize,
				    gl.FLOAT,
				    false,
				    0, 0 );
	    setMatrixUniforms( notShaderProgram );
	    gl.drawArrays( gl.LINE_LOOP, 0, this.hexagonVertexBuffers[i].numItems );
	}
	setShader( lightShaderProgram );
    }
}
BattleHexagonView.prototype = new View;


var BattleUnitView = function( unit ) {
    this.setModel( unit );
    this.register( battlefield );


    this.unitModel = new Model( "ship_medium.obj", "default.png" );
    this.unitModel.setPosition( -3.0, 0.0, -6 );
    this.unitModel.setScale( .03, .03, .03 );
    this.unitModel.setRotation( 90, 0.0, 0.0 );
    this.draw = function() {
	this.unitModel.draw();
    }
}
BattleUnitView.prototype = new View;
*/
