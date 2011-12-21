var HexagonGridView = function( m, height, width, margin )
{
    /// Init:
    this.setModel( m );
    this.register( universe );
    
    this.left = margin;
    this.top = margin;
    var heightAvailable = height - 2.0 * margin;
    var widthAvailable = width - 2.0 * margin;
    var radiusX = widthAvailable / (1.5 * this.model.cols - 1.5);
    var radiusY = heightAvailable / (Math.sqrt(3) * (this.model.rows + 0.5));
    if(radiusX < radiusY)
    {
	this.radius = radiusX;
    }
    else // radiusY < radiusX
    {
	this.radius = radiusY;
    }
    this.boundBox = { xmin: this.left - this.radius,
		      xmax: this.left + this.radius * ( 1.5 * this.model.cols - 0.5 ),
		      ymin: this.top - this.radius * Math.sqrt(3) * 0.5,
		      ymax: this.top + this.radius * Math.sqrt(3) * ( this.model.rows + 1 )
		    };
    
    
    this.drawHexagon = function( x, y )
    {
	var ang = 0.0;
	var step = Math.PI / 3.0;
	ctxBg2d.moveTo(x + this.radius, y);
	for ( var i=0; i<6; i++ )
	{
	    ang += step;
	    ctxBg2d.lineTo( x + this.radius * Math.cos( ang ), y + this.radius * Math.sin( ang ) );
	}
    }

    this.drawHighlightedGrid = function( x, y )
    {
	var ang = 0.0;
	var step = Math.PI / 3.0;
	ctxBg2d.fillStyle = "#00FF00";
	ctxBg2d.beginPath();
	ctxBg2d.moveTo(x + this.radius, y);
	for ( var i=0; i<6; i++ )
	{
	    ang += step;
	    ctxBg2d.lineTo( x + this.radius * Math.cos( ang ), y + this.radius * Math.sin( ang ) );
	}
	ctxBg2d.closePath();
	ctxBg2d.fill();
    }

    this.drawHalfVeiledHexagon = function( x, y, angle ) {
	var ang = 0.0;
	var step = Math.PI / 3.0;
	var r = this.radius;
	var smallerRaidus = this.radius * Math.sqrt(3) * 0.5;
	var dx = 0.5 * ( 1.0- Math.cos(angle) ) * smallerRaidus;
	var dy = Math.sqrt(3) * 0.5 * ( 1.0 - Math.cos(angle) ) * smallerRaidus;
	ctxBg2d.moveTo( x + r - dx , y - dy );
	for ( var i=0; i<6; i++ )
	{
	    ang += step;
	    if ( 0 == i || 5 == i ) {
		ctxBg2d.lineTo( x + r * Math.cos( ang ) - dx, 
				y + r * Math.sin( ang ) - dy );
	    } else if ( 2 == i || 3 == i ) {
		ctxBg2d.lineTo( x + r * Math.cos( ang ) + dx, 
				y + r * Math.sin( ang ) + dy );
	    } else {
		ctxBg2d.lineTo( x + r * Math.cos( ang ), y + r * Math.sin( ang ) );
	    }
	}
    }

    this.highlightCoor = { u: -1, v: -1 };
    
    
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxBg2d } );
    }
    this.requestUpdate();
    
    this.draw = function( ctx )
    {

	if ( ctx == ctxBg2d ) {
	    var x = this.left;
	    var y = this.top;
	    var smallerRadius = this.radius * Math.sqrt(3) * 0.5;
	    
	    ctxBg2d.strokeStyle = "#FFFFFF"
	    ctxBg2d.beginPath();
	    for ( var u=0; u<this.model.cols; u++ ) 
	    {
		y = this.top + this.model.lower[u] * smallerRadius;
		for ( var v=this.model.lower[u]; v<=this.model.upper[u]; v+=2 )
		{
		    this.drawHexagon( x, y );
		    y += smallerRadius * 2;
		}
		x += this.radius * 1.5;
	    }
	    ctxBg2d.closePath();
	    ctxBg2d.stroke();



	    /// Draw Terrans
	    var x = this.left;
	    var y = this.top;
	    for ( var u=0; u<this.model.cols; u++ ) 
	    {
		y = this.top + this.model.lower[u] * smallerRadius;
		for ( var v=this.model.lower[u]; v<=this.model.upper[u]; v+=2 )
		{
		    if ( (!this.model.veil[u][v]) && 
			 (0 != this.model.terran[u][v] )) {
			     if ( "Star" == this.model.terran[u][v].type ) {
				 ctxBg2d.drawImage( resources.getResource( "solarIconImg" ), 
						    x - this.radius, 
						    y - this.radius * 0.625, 
						    this.radius * 2.0,
						    this.radius * 1.25 );
				 if ( this.model.terran[u][v].owner ) {
				     ctxBg2d.drawImage( 
					 this.model.terran[u][v].owner.colorFlag, 
					 x - this.radius * 0.5,
					 y - this.radius * 0.8,
					 this.radius,
					 this.radius  
				     );
				 }
			     } else if ( "Mine" == this.model.terran[u][v].type ) {
				 ctxBg2d.drawImage( resources.getResource( "mineStarImg" ), 
						    x - this.radius * 0.9,
						    y - this.radius * 0.9,
						    this.radius * 1.8,
						    this.radius * 1.8 );
				 if ( this.model.terran[u][v].landlord ) {
				     ctxBg2d.drawImage( 
					 this.model.terran[u][v].landlord.colorFlag, 
					 x - this.radius * 0.5,
					 y - this.radius * 0.8,
					 this.radius,
					 this.radius  
				     );
				 }
			     } else if ( "Obstacle" == this.model.terran[u][v].type ) {
				 ctxBg2d.drawImage( resources.getResource( "obstacleImg" ), 
						    x - this.radius * 0.9,
						    y - this.radius * 0.9,
						    this.radius * 1.8,
						    this.radius * 1.8 );
				 
			     }
		    }
		    y += smallerRadius * 2;
		}
		x += this.radius * 1.5;
	    }



	    

	    /// draw Veils
	    var x = this.left;
	    var y = this.top;
	    ctxBg2d.fillStyle = "rgba(255,255,255,0.2)";
	    ctxBg2d.beginPath();
	    for ( var u=0; u<this.model.cols; u++ ) 
	    {
		y = this.top + this.model.lower[u] * smallerRadius;
		for ( var v=this.model.lower[u]; v<=this.model.upper[u]; v+=2 )
		{
		    if ( this.model.veil[u][v] ) {
			this.drawHexagon( x, y );
		    }
		    y += smallerRadius * 2;
		}
		x += this.radius * 1.5;
	    }
	    ctxBg2d.closePath();
	    ctxBg2d.fill();

	    
	    /// draw Half-Veiled Cells
	    ctxBg2d.fillStyle = "rgba(255,255,255,0.2)";
	    ctxBg2d.beginPath();
	    for ( var i=0; i<this.model.unveilAnimations.length; i++ ) {
		var c = this.getXYFromUV( this.model.unveilAnimations[i].u,
					  this.model.unveilAnimations[i].v );
		this.drawHalfVeiledHexagon( c.x, c.y, this.model.unveilAnimations[i].angle );
	    }
	    ctxBg2d.closePath();
	    ctxBg2d.fill();
	    
	    
	    // draw highlighted cell last
	    if ( this.highlightCoor.u > -1 )
	    {
		this.drawHighlightedGrid( this.left + this.radius * 1.5 * this.highlightCoor.u,
					  this.top + this.highlightCoor.v * smallerRadius );
	    }
	} else {
	    return ;
	}
    }

    this.getUVFromXY = function( x, y )
    {
	var smallerRadius = this.radius * Math.sqrt(3) * 0.5;
	var deltaX = x - this.left;
	var deltaY = y - this.top;
	var v = Math.ceil( deltaY / smallerRadius );
	var u = Math.round( deltaX / (1.5 * this.radius) );
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
	return  { x: this.radius * 1.5 * u + this.left, 
		  y: this.radius * Math.sqrt(3) * 0.5 * v + this.top };
    }

    /// Implement mouse related functions
    this.hitTest = function( x, y ) {
	if ( x < this.boundBox.xmin ||
	     x > this.boundBox.xmax ||
	     y < this.boundBox.ymin ||
	     y > this.boundBox.ymax ) {
	    return false;
	}
	return true;
    }

    this.onRightMouseDown = function( x, y ) {
	dispatcher.broadcast( { name: "DeselectCommander" } );
    }
    this.onLeftMouseDown = function( x, y ) {
	var uv = this.getUVFromXY( x, y );
	var obj = this.model.getMap( uv.u, uv.v );
	var terran = this.model.terran[uv.u][uv.v];
	var status = logic.getStatus();
	trace( uv.u + "," + uv.v );
	if ( obj.type == "Commander" && !logic.status.onSelect) {
	    dispatcher.broadcast( { name: "SelectCommander",
				    obj: obj } );
	} else if ( 0 != terran && !logic.status.onSelect ) {
	    if ( "Star" == terran.type && 0 == terran.owner.groupID ) {
		dispatcher.broadcast( { name: "CreateCommander",
					star: terran
				      } );
	    }
	} else if ( status.onSelect != null )
	{
	    obj = status.onSelect;
	    if ( "Commander" == obj.type && 0 == obj.group )
	    {
		if ( uv.u == status.onSelect.target.u && uv.v == status.onSelect.target.v )
		{
		    dispatcher.broadcast( { name: "CommanderMove" } );
		}	
		else
		{
		    if ( this.model.inMap( uv.u, uv.v ) )
		    {
			dispatcher.broadcast( { name: "RequestArrowPath", 
						obj: obj,
						target: uv } );
		    }
		}
	    }
	}
    }
    this.onMouseMove = function( x, y ) {
	var status = logic.getStatus();
	var uv = this.getUVFromXY( x, y );
	if ( uv.u != -1 && ( uv.u != this.highlightCoor.u ||
			     uv.v != this.highlightCoor.v ) ) {
	    status.attackIcon.u = -1;
	    this.highlightCoor.u = uv.u;
	    this.highlightCoor.v = uv.v;
	    this.requestUpdate();
	}
    }
}
HexagonGridView.prototype = new View();




var CommanderUniverseView = function( commander ) {
    this.setModel( commander );
    this.register( universe );
    
    this.draw = function( ctx ) {
	if ( ctx == ctx2d[0] ) {
	    if ( 0 != this.model.group && 
		 univMap.veil[this.model.u][this.model.v] ) {
		return;
	    }
	    c = univMapView.getXYFromUV( this.model.u, this.model.v );
	    var size = univMapView.radius * 1.90 * this.model.scale;
	    if ( this.model == logic.status.onSelect ) {
		drawRotatedImage( ctx2d[0],
				  resources.getResource( "commander" + this.model.group +"SelectImg" ),
				  Math.PI * 2 / 6 * this.model.orientation,
				  c.x,
				  c.y,
				  size,
				  size,
				  true );
	    } else {
		drawRotatedImage( ctx2d[0],
				  resources.getResource( "commander"+this.model.group+"Img" ),
				  Math.PI * 2 / 6 * this.model.orientation,
				  c.x,
				  c.y,
				  size,
				  size,
				  true );
	    }
	}
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctx2d[0] } );
    }
    this.requestUpdate();
}
CommanderUniverseView.prototype = new View;


var CommanderMoveAnimation = function( commanderObj ) {
    this.objs = new Array();
    this.objs.push( commanderObj );
    if (commanderObj.path && commanderObj.AP >= commanderObj.path.length ) {
	this.lifetime = commanderObj.path.length * 5;
    } else {
	this.lifetime = commanderObj.AP * 5;
	if ( 0 >= commanderObj.AP ) {
	    var c = univMapView.getXYFromUV( commanderObj.u, commanderObj.v );
	    new TimedBubble( new Bubble( 
		"Ooops! Used up all my Action Points, sir!", "textfield1", 
		universe, c.x, c.y,
		160, 40 ), 100 );
	}
    }
    this.onStart = function() {
	logic.status.onAnimation ++;
    }
    this.onTerminate = function() {
	logic.status.onAnimation --;
	
	var terran = univMap.terran[this.objs[0].u][this.objs[0].v];
	if ( 0 != terran ) {
	    if ( "Mine" == terran.type ) {
		terran.onOccupy( this.objs[0] );
	    }
	}
	if ( this.special ) {
	    var enemy = univMap.getMap( 
		this.objs[0].u + univMap.du[this.objs[0].path[0]],
		this.objs[0].v + univMap.dv[this.objs[0].path[0]] );
	    if ( enemy.group != this.objs[0].group ) {
		dispatcher.broadcast( {name: "StartBattle",
				       commander0: this.objs[0],
				       commander1: enemy } );
	    }
	    this.objs[0].path = new Array();
	} else if ( "Star" == terran.type ) {
	    if ( terran.owner ) {
		if ( this.objs[0].group == terran.owner.groupID ) {
		    dispatcher.broadcast( { name: "EnterSolarSystem",
					    visiting: this.objs[0],
					    star: terran } );
		} else {
		    terran.owner.createCommander( "Defender", "Cannons", -1, -1 );
		    var defender = terran.owner.commanders[
			terran.owner.commanders.length -1 ];
		    defender.type = "defender";
		    defender.star = terran;
		    for ( var i=0; i<terran.defenseSystem; i++ ) {
			defender.addUnit( Cannon );
		    }
		    dispatcher.broadcast( {name: "StartBattle",
					   commander0: this.objs[0],
					   commander1: defender } );
		}
	    } else {
		terran.setOwner( forces[this.objs[0].group] );
	    }
	} 
    }

    this.tick = 0;
    this.special = false;
    this.next = function() {
	if ( 0 == this.tick % 5 ) {
	    this.objs[0].setOrientation( this.objs[0].path[0] );
	    if ( this.objs[0].stepForward() ) {
		this.objs[0].path.splice(0,1);
		logic.requestUpdate();
	    } else {
		this.special = true;
	    }
	}
    }
    this.init();
}
CommanderMoveAnimation.prototype = new Tween;



var CommanderDeathAnimation = function( cmder ) {
    this.objs = new Array();
    this.objs.push( cmder );
    this.lifetime = 40;
    this.tick = 0;
    this.onStart = function() {
	logic.status.onAnimation ++;
    }
    this.onTerminate = function() {
	this.objs[0].terminate();
	logic.status.onAnimation --;
    }

    this.next = function() {
	if ( 0 == this.tick % 2 ) {
	    this.objs[0].setScale( this.objs[0].scale - 0.04 );
	}
    }
    this.init();
}
CommanderDeathAnimation.prototype = new Tween;


/*
 * LogicView Singleton : Including Menu
 */

var UniverseLogicView = function( logicModel ) {
    this.months = [ "Nothing", 
		    "Jan",
		    "Feb",
		    "Mar",
		    "Apr",
		    "May",
		    "Jun",
		    "Jul",
		    "Aug",
		    "Sep",
		    "Oct",
		    "Nov",
		    "Dec" ];
    this.setModel( logicModel );
    this.register( universe );
    this.drawArrows = function() {
	var status = this.model.getStatus();
	if ( status.onSelect != null ) {
	    var obj = status.onSelect;
	    
	    if ( obj.type == "Commander" && 0 == obj.group ) {
		if ( -1 != status.attackIcon.u ) {
		    var size = univMapView.radius * 1.40;
		    var c = univMapView.getXYFromUV( status.attackIcon.u, 
						     status.attackIcon.v );
		    drawRotatedImage( ctx2d[1],
				      resources.getResource( "swordIcon" ),
				      0,
				      c.x,
				      c.y,
				      size,
				      size,
				      true );
		}
		if ( obj.path != null && status.showArrows) {
		    var u = obj.u;
		    var v = obj.v;
		    var size = univMapView.radius * 1.40;
		    for ( var i=0; i<obj.path.length; i++ ) {
			u += univMap.du[obj.path[i]];
			v += univMap.dv[obj.path[i]];
			var c = univMapView.getXYFromUV( u, v );
			var enemy = univMap.getMap( u, v );
			if ( 0 != enemy && enemy.group != 0 ) {
			    drawRotatedImage( ctx2d[1],
					      resources.getResource( "attackIcon" ),
					      - Math.PI * 0.75,
					      c.x,
					      c.y,
					      26,
					      52,
					      true );
			    drawRotatedImage( ctx2d[1],
					      resources.getResource( "attackIcon" ),
					      Math.PI * 0.75,
					      c.x,
					      c.y,
					      26,
					      52,
					      true );
			    return;
			}
			if ( i < obj.AP ) {
			    if ( i != obj.path.length-1 ) {
				drawRotatedImage( ctx2d[1],
						  resources.getResource( "greenArrowImg" ),
						  Math.PI * 2 / 6 * obj.path[i+1],
						  c.x,
						  c.y,
						  size,
						  size,
						  true );
			    } else {
				drawRotatedImage( ctx2d[1],
						  resources.getResource( "targetImg" ),
						  0,
						  c.x,
						  c.y,
						  size,
						  size,
						  true );
			    }
			} else {
			    if ( i != obj.path.length-1 ) {
				drawRotatedImage( ctx2d[1],
						  resources.getResource( "redArrowImg" ),
						  Math.PI * 2 / 6 * obj.path[i+1],
						  c.x,
						  c.y,
						  size,
						  size,
						  true );
			    } else {
				drawRotatedImage( ctx2d[1],
						  resources.getResource( "redTargetImg" ),
						  0,
						  c.x,
						  c.y,
						  size,
						  size,
						  true );
			    }
			}
		    }
		}
	    }
	}
    }
    this.draw = function( ctx ) {
	if ( ctx == ctx2d[1] ) {
	    this.drawArrows();
	} else if ( ctx == ctxMenu ) {
	    ctxMenu.fillStyle = "#0000FF";
	    ctxMenu.font = "20px Arial";
	    ctxMenu.textAlign = "center";
	    ctxMenu.textBaseline = "top";
	    ctxMenu.fillText( this.months[this.model.status.month] 
			      + ", " + this.model.status.year + " B.C.",
			      920, 20 );
	}
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctx2d[1] } );
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
    }
}
UniverseLogicView.prototype = new View;


var LevelUpSub = function( x, y ) {
    this.views = new Array();
    this.frame = 0;
    this.x = x;
    this.y = y;
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
    this.init();
}
LevelUpSub.prototype = new GameObject;

var LevelUpSubView = function( m ) {
    this.setModel( m );
    this.register( universe );
    this.draw = function( ctx ) {
	if ( ctx == ctxMenu ) {
	    ctx.fillStyle = "#0066FF";
	    ctx.textAlign = "center";
	    ctx.textBaseline = "alphabetic";
	    ctx.fillText( "Level Up", this.model.x, this.model.y );
	}
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );	
    }
    this.requestUpdate();
}
LevelUpSubView.prototype = new View;


var LevelUpAnimation = function( obj ) {
    this.objs = new Array();
    this.objs.push( obj );
    

    this.levelup = new LevelUpSub();
    var c = univMapView.getXYFromUV( obj.u, obj.v );
    this.levelup.setPos( c.x, c.y );
    this.levelupView = new LevelUpSubView( this.levelup );


    this.lifetime = 50;
    this.tick = 0;
    this.init();
    logic.status.onAnimation++;
    this.next = function() {
	if ( 0 == this.tick % 5 ) {
	    this.levelup.shift( 0, -2 );
	}
    }
    
    this.onTerminate = function() {
	this.levelup.removeInstance();
	this.levelup = null;
	this.levelupView = null;
	logic.status.onAnimation--;
    }
}
LevelUpAnimation.prototype = new Tween;







