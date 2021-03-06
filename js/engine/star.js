var starImage = new Image();
starImage.src = "img/star.png";

var StarSolarView = function( m ) {
    this.setModel( m );
    this.that = this;
    /// Do register a view on stage !!!
    this.register( solarSystem );
    
    this.draw = function()
    {
	if ( this.model.active ) {
	    //tilt camera and then draw
	    if(this.left == 1)
	    {
		cam.circleZ();
	    }
	    if(this.right == 1)
	    {
		cam.circleNZ();
	    }
	    if(this.up == 1)
	    {
		cam.rotateUp();
	    }
	    if(this.down == 1)
	    {
		cam.rotateDown();
	    }
	    this.model.starModel.draw();
	    this.model.starModel2.draw(); //star cloud
	    starfield.draw();
	    cam.update();
	}
    }
    
    this.onKeyDown = function(key)
    {
	switch(key)
	{
	    // When one direction is set to 1, the other direction is set to 0
	    // This ameliorates an issue where javascript lags a little and the keyUp event is never fired
	case 37: // left arrow
	    this.left = 1;
	    this.right = 0;
	    break;
	case 38: // up arrow
	    this.up = 1;
	    this.down = 0;
	    break;
	case 39: // right arrow
	    this.right = 1;
	    this.left = 0;
	    break;
	case 40: // down arrow
	    this.down = 1;
	    this.up = 0;
	    break;
	}
    }
    this.onKeyUp = function(key)
    {
	switch(key)
	{
	case 37: // left arrow
	    this.left = 0;
	    break;
	case 38: // up arrow
	    this.up = 0;
	    break;
	case 39: // right arrow
	    this.right = 0;
	    break;
	case 40: // down arrow
	    this.down = 0;
	    break;
	}
    }
    
}
StarSolarView.prototype = new View();

/*
  var StarUniverseView = function( m )
  {
  this.setModel(m);
  this.that = this;
  this.register(universe);
  
  this.draw = function()
  {
  var scale = univMapView.radius * 1.5;
  ctxBg2d.drawImage(starImage, this.model.position[0] - scale / 2, this.model.position[1] - scale / 2, scale, scale);
  }
  }
  StarUniverseView.prototype = new View();
*/

var minerPrice = 1000;
var refineryPrice = 5000;
var powerPlantPrice = 600;
var defenseSystemPrice = new Array();
defenseSystemPrice[0] = 1000;
defenseSystemPrice[1] = 2000;
defenseSystemPrice[2] = 5000;
defenseSystemPrice[3] = 5000000;

var stars = new Array();

var Star = function(texture, x, y, z, radius, u, v ) {
    
    /// Put the star into the Array of all solar systems
    stars.push( this );
    
    /// The coordinates on the universe map
    this.u = u;
    this.v = v;
	
	this.name = getSolarName();

    this.defenseSystem = 1;
    /// Put the solar system onto the universe map
    univMap.addSolarSystem( u, v, this );
    
    /// Type for terran detection 
    this.type = "Star";

    /// The visiting commander
    this.visiting = null;

    /// The force that owns this solar system
    this.owner = null;
    this.setOwner = function( force ) {
	if ( this.owner ) {
	    this.owner.removeSolar( this );
	}
	this.defenseSystem = 1;
	this.quantities[7] = 2;
	this.owner = force;
	this.owner.declareSolar( this );
	univMap.requestUpdate();
    }

	
	
	this.getMinerPrice = function() {
		return minerPrice;
	}
	
	this.getRefineryPrice = function() {
		return refineryPrice;
	}
	
	this.getPowerPlantPrice = function() {
		return powerPlantPrice;
	}
	
	this.getDefenseSystemPrice = function() {
		return defenseSystemPrice[this.defenseSystem];
	}

    /// The quantities of battle units that this star can
    /// produce currently
    this.quantities = new Array();
    for ( var i=0; i < 10; i++ ){
		this.quantities[i] = 1;
    }
	this.quantities[7] = 3;

    this.addMiner = function() {
		if (this.quantities[6] <= 0) {
			return;
		}
		if (this.owner == null) {
			return;
		}
		if (this.owner.gold < minerPrice) {
			return;
		}
		this.owner.gold -= minerPrice;
		this.miners++;
		this.owner.updateIncome();
		this.quantities[6] --;
	}
	
	this.addDefenseSystem = function() {
		if (this.quantities[7] <= 0) {
			return;
		}
		if (!this.owner) {
			return;
		}
		if (this.owner.gold < defenseSystemPrice[this.defenseSystem]) {
			return;
		}
		this.owner.gold -= defenseSystemPrice[this.defenseSystem];
		this.defenseSystem++;
		this.quantities[7] --;
	}
	
	this.addRefinery = function() {
		if (this.quantities[8] <= 0) {
			return;
		}
		if (this.owner == null) {
			return;
		}
		if (this.owner.gold < refineryPrice) {
			return;
		}
		this.owner.gold -= refineryPrice;
		this.hasRefinery = true;
		this.incomeRate *= 2;
		this.owner.updateIncome();
		this.quantities[8] --;
	}
	
	this.addPowerPlant = function() {
		if (this.quantities[9] <= 0) {
			return;
		}
		if (this.owner == null) {
			return;
		}
		if (this.owner.gold < powerPlantPrice) {
			return;
		}
		this.owner.gold -= powerPlantPrice;
		this.hasPowerPlant = true;
		this.quantities[9] --;
	}

    /// The owner get incomeRate * #miner gold each turn
    this.incomeRate = 100;
	
    this.position = vec3.create();
    this.position[0] = x;
    this.position[1] = y;
    this.position[2] = z;
    this.radius = 3;//radius;
    this.starModel = new Model("ball.obj", texture);
    this.starModel.setPosition(this.position[0], this.position[1], this.position[2]);
    this.starModel.setScale(this.radius, this.radius, this.radius);
    this.starModel.useLighting(false);
    this.starModel.constantRotation(0,0.08,0);
    this.starModel.setRotation(90, 0, 0);
    
    //star clouds
    this.starModel2 = new Model("ball.obj", "clouds.png");
    this.starModel2.setPosition(this.position[0], this.position[1], this.position[2]);
    this.starModel2.setScale(this.radius + 0.1, this.radius + 0.1, this.radius + 0.1);
    this.starModel2.useLighting(false);
    this.starModel2.constantRotation(0.3,0,0);
    this.starModel2.setRotation(90, 0, 0);
    
    //end star clouds "flares"
    
    
    var that = this;

    /// Add views:
    new StarSolarView( this );
    
    /// do init a game object before using it
    this.init();
    this.active = false;
    
    
    this.update = function()
    {
	this.starModel.update(); //star rotations
	this.starModel2.update(); //star flare rotation
	for(var i = 0; i < this.planets.length; i++)
	{
	    this.planets[i].update();
	}
    }
    
    this.planets = new Array();
    var radii = [random(7,8), random(14, 16), random(19, 22)];
    var radii2 = [random(10,12)];
    var textures1 = ["testPlanet.png", "planet2.png", "planet9.png", "planet7.png"]; // habitable
    var textures2 = ["planet3.png", "planet4.png", "planet5.png", "planet6.png", "planet8.png", "planet10.png", "planet11.png", "planet12.png"]; // barren 68 10 11 12
    
    var planet2 = new Planet(textures1[Math.floor(Math.random()*textures1.length)], "clouds.png", -8, 0, -20, 1, radii2[0], this, new PlanetInfo(null, "Joe"), this );
    planet2.orbitVelocity = 0.003 / planet2.orbitRadius;
    this.planets.push(planet2); 
    
    for(var i = 0; i < radii.length; i++)
    {
	var x = Math.random();
	if(x > 0.3) // 50% chance of a planet in each orbit
	{
	    var planet = new Planet(textures2[Math.floor(Math.random()*textures2.length)], null, -8, 0, -20, (Math.random() * 1.5) + 0.5, radii[i], this, null, this );
	    planet.orbitVelocity = 0.003 / planet.orbitRadius;
	    this.planets.push(planet);
	}
    }
    this.quantities[6] = this.planets.length - 1;
    /// Every Turn, the onwer gains gold
    dispatcher.addListener( "NewTurn", this);
    this.onNewTurn = function( e ) {
	if ( this.owner ) {
	    this.owner.gold += that.miners * that.incomeRate;
		
	}
    }
    
	
	
    /// Every Year, new ships will be added into shipyard
    dispatcher.addListener( "NewYear", this );
    this.onNewYear = function( e ) {
	for ( var i=0; i < 6; i++ ) {
	    this.quantities[i] += UnitTypes[i].production;
	}
	this.quantities[7] = 3;
    }
    
    
    this.miners = 1; // number of miners in the system
    this.defenseSystem = 1;
    this.hasRefinery = false;
    this.hasPowerPlant = false;
    var openButton = new planetMenuOpenButton("Open Planet Menu", 50, 670, this);
    var leaveButton = new exitSolarSystemButton("Leave Solar System", 50, 730, this);
	var solarInfo = new solarInfoPanel(this);
}

Star.prototype = new GameObject();

var planetMenuOpenButton = function(name, xPos, yPos, model) {
    this.setModel(model);
    this.register( solarSystem );
    this.xPos = xPos;
    this.yPos = yPos;
    this.name = name;
    this.highlighted = false;
    this.active = true;
    var that = this;

    /// Style Parameters
    this.shadowDist = 2;
    this.color = "#FFFFFF";
    this.shadowColor = "#000000";
    this.highlightColor = "rgba(255,255,255,0.1)";
    this.highlightColor2 = "rgba(255,255,255,0.2)";
    this.strokeStyle = "rgba(50,50,200, 0.5)";
    this.strokeStyle2 = "rgba(50,50,200, 0.7)";
    this.font = "28px Eras Bold ITC"
    this.buttonWidth = 300;
    this.buttonHeight = 40;
    this.xOffset = -17;
    this.yOffset = -30;
    this.lineWidth = 3;
    this.edgeOffset = 10;
    
    this.draw = function( ctx ) {
	if (ctx == ctxMenu && that.active) {
	    ctx.beginPath();
	    ctx.moveTo(that.xPos + that.buttonWidth + that.xOffset, that.yPos + that.yOffset);
	    ctx.lineTo(that.xPos + that.edgeOffset + that.xOffset, that.yPos + that.yOffset);
	    ctx.lineTo(that.xPos + that.xOffset, that.yPos + that.edgeOffset + that.yOffset);
	    ctx.lineTo(that.xPos + that.xOffset, that.yPos + that.buttonHeight + that.yOffset);
	    ctx.lineTo(that.xPos + that.buttonWidth - that.edgeOffset + that.xOffset, that.yPos + that.buttonHeight + that.yOffset);
	    ctx.lineTo(that.xPos + that.buttonWidth + that.xOffset, that.yPos + that.buttonHeight - that.edgeOffset + that.yOffset);
	    ctx.lineTo(that.xPos + that.buttonWidth + that.xOffset, that.yPos + that.yOffset);
	    ctx.closePath();
	    ctx.lineWidth = that.lineWidth;
	    if (that.highlighted) {
		ctx.strokeStyle = that.strokeStyle2;
		ctx.fillStyle = that.highlightColor2;
	    } else {
		ctx.strokeStyle = that.strokeStyle;
		ctx.fillStyle = that.highlightColor;
	    }
	    
	    ctx.fill();
	    ctx.stroke();


	    ctx.font = that.font;
	    ctx.fillStyle = that.shadowColor;
	    ctx.textBaseline = "alphabetic";
	    ctx.textAlign = "start";
	    ctx.fillText(that.name, that.xPos + that.shadowDist, that.yPos + that.shadowDist);

	    
	    ctx.fillStyle = that.color;
	    ctx.font = that.font;
	    if (that.highlighted) {
		ctx.textBaseline = "alphabetic";
		ctx.textAlign = "start";
		ctx.strokeStyle = "#000000";
		ctx.strokeText(that.name, that.xPos - 2, that.yPos - 1);
		ctx.fillText(that.name, that.xPos - 2, that.yPos - 1);

	    } else {
		ctx.textBaseline = "alphabetic";
		ctx.textAlign = "start";
		ctx.strokeStyle = "#000000";
		ctx.strokeText(that.name, that.xPos, that.yPos, 1);
		ctx.fillText( that.name, that.xPos, that.yPos);
	    }
	}
    }
    
    this.onLeftMouseDown = function( x, y ) {
	if (that.active) {
	    dispatcher.broadcast( { name: "OpenPlanetMenu",
				    force: planetMenu.star.owner,
				    commander: that.model.visiting ,
				    planet: that.model.planets[0],
				    ss: that.model} );
	    that.active = false;
	}
    }
    
    dispatcher.addListener("ShowPlanetButton", this);
    this.onShowPlanetButton = function(e) {
	if (e.display == true) {
	    that.active = true;
	}
    }
    
    
    this.onMouseMove = function( x, y ) {
	if (that.active) {
	    that.highlighted = true;
	    this.requestUpdate();
	}
    }
    
    this.onRollOut = function( x, y ) {
	if ( that.active ) {
	    that.highlighted = false;
	    this.requestUpdate();
	}
    }
    
    this.hitTest = function( x, y ) {
	if ( x < that.xPos + that.buttonWidth + that.xOffset && x > that.xPos + that.xOffset &&
	     y < that.yPos + that.buttonHeight + that.yOffset && y > that.yPos + that.yOffset) {
	    return true;
	} else {
	    return false
	}
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
    }
    this.requestUpdate();
}
planetMenuOpenButton.prototype = new View;


var exitSolarSystemButton = function(name, xPos, yPos, model) {
    this.setModel(model);
    this.register( solarSystem );
    this.xPos = xPos;
    this.yPos = yPos;
    this.name = name;
    this.highlighted = false;
    this.active = true;
    var that = this;
    this.shadowDist = 2;
    this.color = "#FFFFFF";
    this.shadowColor = "#222222";
    this.highlightColor = "rgba(255,255,255,0.1)";
    this.highlightColor2 = "rgba(255,255,255,0.2)";
    this.strokeStyle = "rgba(50,50,200, 0.5)";
    this.strokeStyle2 = "rgba(50,50,200, 0.7)";
    this.font = "28px Eras Bold ITC"
    this.buttonWidth = 300;
    this.buttonHeight = 40;
    this.xOffset = -17;
    this.yOffset = -30;
    this.lineWidth = 3;
    this.edgeOffset = 10;
    
    this.draw = function( ctx ) {
	if (ctx == ctxMenu && that.active) {
	    var ctx = ctxMenu;
	    var originalColor = ctx.fillStyle;
	    var originalFont = ctx.font;
	    
	    ctx.beginPath();
	    ctx.moveTo(that.xPos + that.buttonWidth + that.xOffset, that.yPos + that.yOffset);
	    ctx.lineTo(that.xPos + that.edgeOffset + that.xOffset, that.yPos + that.yOffset);
	    ctx.lineTo(that.xPos + that.xOffset, that.yPos + that.edgeOffset + that.yOffset);
	    ctx.lineTo(that.xPos + that.xOffset, that.yPos + that.buttonHeight + that.yOffset);
	    ctx.lineTo(that.xPos + that.buttonWidth - that.edgeOffset + that.xOffset, that.yPos + that.buttonHeight + that.yOffset);
	    ctx.lineTo(that.xPos + that.buttonWidth + that.xOffset, that.yPos + that.buttonHeight - that.edgeOffset + that.yOffset);
	    ctx.lineTo(that.xPos + that.buttonWidth + that.xOffset, that.yPos + that.yOffset);
	    ctx.closePath();
	    var originalWidth = ctx.lineWidth;
	    ctx.lineWidth = that.lineWidth;
	    if (that.highlighted) {
		ctx.strokeStyle = that.strokeStyle2;
		ctx.fillStyle = that.highlightColor2;
	    } else {
		ctx.strokeStyle = that.strokeStyle;
		ctx.fillStyle = that.highlightColor;
	    }
	    
	    ctx.fill();
	    ctx.stroke();
	    ctx.lineWidth = originalWidth;
	    
	    ctx.font = that.font;
	    ctx.fillStyle = that.shadowColor;
	    ctx.textBaseline = "alphabetic";
	    ctx.textAlign = "start";
	    ctx.fillText(that.name, that.xPos + that.shadowDist, that.yPos + that.shadowDist);
	    
	    ctx.fillStyle = that.color;
	    ctx.font = that.font;
	    if (that.highlighted) {
		ctx.strokeStyle = "#000000";
		ctx.strokeText(that.name, that.xPos - 2, that.yPos - 1);
		ctx.fillText(that.name, that.xPos - 2, that.yPos - 1);

	    } else {
		ctx.strokeStyle = "#000000";
		ctx.strokeText(that.name, that.xPos, that.yPos, 1);
		ctx.fillText(that.name, that.xPos, that.yPos);
	    }
	    ctx.fillStyle = originalColor;
	    ctx.font = originalFont;
	}
    }
    

    this.onLeftMouseDown = function( e ) {
	if (that.active) {
	    planetMenu.star.active = false;
	    planetMenu.commanderPanel.removeInstance();
	    game.setStage( universe );
	}
    }
    

    this.onOpenPlanetMenu = function(e) {
	that.active = false;
    }
    

    this.onShowPlanetButton = function(e) {
	if (e.display == true) {
	    that.active = true;
	}
    }
    
    
    this.onMouseMove = function( x, y ) {
	if (that.active) {
	    that.highlighted = true;
	}
    }


    this.onRollOut = function( x, y ) {
	if ( that.active ) {
	    that.highlighted = false;
	}
    }
    
    this.hitTest = function( x, y ) {
	if ( x < that.xPos + that.buttonWidth + that.xOffset && x > that.xPos + that.xOffset &&
	     y < that.yPos + that.buttonHeight + that.yOffset && y > that.yPos + that.yOffset) {
	    return true;
	} else {
	    return false
	}
    }
	
	dispatcher.addListener( "OpenPlanetMenu", this );
    this.onOpenPlanetMenu = function( e ) {
	this.active = false;
    }

    dispatcher.addListener("ShowPlanetButton", this);
    this.onShowPlanetButton = function(e) {
	this.active = true;
    }
	
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
    }
    this.requestUpdate();
}
exitSolarSystemButton.prototype = new View;




var CommanderInfoPanel = function( commander, right, top ) {
    this.setModel( commander );
    this.register( solarSystem );
    this.top = top;
    this.right = right;
    this.width = 240;
    this.height = 320;
    this.maxAP = 10.0;
    this.APBarLen = 150.0;
    this.active = true;
    this.draw = function( ctx ) {
	if ( ctx == ctxMenu && this.active ) {
	    /// Draw Frame
	    ctxMenu.strokeStyle = "#FFFFFF";
	    ctxMenu.lineWidth = 2;
	    ctxMenu.strokeRect( this.right - this.width - 2, 
				this.top, this.width, this.height );
	    
	    /// Draw Title and name
	    ctxMenu.fillStyle = "#FFFF00";
	    ctxMenu.font = "18px Arial";
	    ctxMenu.textAlign = "left";
	    ctxMenu.textBaseline = "alphabetic";
	    ctxMenu.fillText( this.model.title, 
			      this.right - this.width + 10,
			      this.top + 45 );
	    
	    ctxMenu.strokeStyle = "#00AABB";
	    ctxMenu.font = "20px Arial";
	    ctxMenu.textBaseline = "alphabetic";
	    ctxMenu.strokeText( this.model.name,
				this.right - this.width + 100,
				this.top + 45 );
	    /// Draw Level
	    ctxMenu.fillStyle = "#FFFFFF";
	    ctxMenu.font = "22px Arial";
	    ctxMenu.fillText( "Lv. " + this.model.level, this.right - this.width - 2 + 10,
			      this.top + 80 );

	    /// Draw Attack and Defence
	    ctxMenu.drawImage( resources.getResource("swordIcon"),
			       this.right - this.width - 2 + 10,
			       this.top + 100,
			       40, 40 );
	    ctxMenu.fillStyle = "#FF4444";
	    ctxMenu.font = "25px Arial";
	    ctxMenu.fillText( this.model.att,
			      this.right - this.width - 2 + 50,
			      this.top + 130 );

	    ctxMenu.drawImage( resources.getResource("shieldIcon"),
			       this.right - 100,
			       this.top + 100,
			       40, 40 );
	    ctxMenu.fillStyle = "#4444FF";
	    ctxMenu.font = "25px Arial";
	    ctxMenu.fillText( this.model.def,
			      this.right - 60,
			      this.top + 130 );


	    /// Draw Units
	    ctxMenu.lineWidth = 1;
	    ctxMenu.strokeStyle = "#FFFFFF";
	    ctxMenu.strokeRect( this.right - this.width + 12 + 15, this.top+160, 60, 60  );
	    ctxMenu.strokeRect( this.right - this.width + 12 + 75, this.top+160, 60, 60  );
	    ctxMenu.strokeRect( this.right - this.width + 12 + 135, this.top+160, 60, 60  );
	    ctxMenu.strokeRect( this.right - this.width + 12 + 15, this.top+220, 60, 60  );
	    ctxMenu.strokeRect( this.right - this.width + 12 + 75, this.top+220, 60, 60  );
	    ctxMenu.strokeRect( this.right - this.width + 12 + 135, this.top+220, 60, 60  );
	    var x = this.right - this.width + 12 + 15;
	    var y = this.top + 160;
	    var k = 0;
	    for ( var i=0; i<2; i++ ) {
		var x = this.right - this.width + 12 + 15;
		for ( var j=0; j<3; j++ ) {
		    if ( k < this.model.units.length ) {
			drawRotatedImage( ctxMenu,
					  this.model.units[k].template.image,
					  0,
					  x,
					  y,
					  50,
					  50,
					  false );
			ctxMenu.fillStyle = "#00AAFF";
			ctxMenu.font = "15px Arial";
			ctxMenu.textBaseline = "top";
			ctxMenu.textAlign = "center";
			ctxMenu.fillText( this.model.units[k].quantity, 
					  x + 40,
					  y + 40 );
			k++;
		    } else {
			break;
		    }
		    x += 60;
		}
		y+=60;
	    }
	    
	}
    }

    
    dispatcher.addListener( "OpenPlanetMenu", this );
    this.onOpenPlanetMenu = function( e ) {
	this.active = false;
    }

    dispatcher.addListener("ShowPlanetButton", this);
    this.onShowPlanetButton = function(e) {
	this.active = true;
    }

    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
    }
    this.requestUpdate();
}
CommanderInfoPanel.prototype = new View;



var solarInfoPanel = function( star ) {
    this.star = star
	this.register( solarSystem );
    this.xPos = 1000;
	this.yPos = 50;
	this.spacing = 40;
	this.shadowX = 1;
	this.shadowY = 2;
	this.font1 = "32px Arial Bold";
	this.font2 = "22px Arial Bold";
	this.shadowColor = "rgb(0,0,0)";
	this.fontColor = "rgb(255,255,255)";
	this.strokeColor = "rgb(100,100,100)";
    this.active = true;
    this.draw = function( ctx ) {
	if ( ctx == ctxMenu && this.active && this.star.active ) {
	    ctx.textAlign = "right";
		ctx.font = this.font1;
		ctx.strokeStyle = this.strokeColor;
		
		ctx.fillStyle = this.shadowColor;
		ctx.fillText(this.star.name, this.xPos + this.shadowX, this.yPos + this.shadowY);
		ctx.fillStyle = this.fontColor;
		ctx.fillText(this.star.name, this.xPos, this.yPos);
		//ctx.strokeText(this.star.name, this.xPos, this.yPos);
		
		ctx.font = this.font2;
		
		ctx.fillStyle = this.shadowColor;
		ctx.fillText("Defense Turrets: " + this.star.defenseSystem, this.xPos + this.shadowX, this.yPos + this.shadowY + this.spacing);
		ctx.fillStyle = this.fontColor;
		ctx.fillText("Defense Turrets: " + this.star.defenseSystem, this.xPos, this.yPos + this.spacing);
		//ctx.strokeText("Defense Turrets: " + this.star.defenseSystem, this.xPos, this.yPos + this.spacing);
		
		ctx.fillStyle = this.shadowColor;
		ctx.fillText("Miners: " + this.star.miners, this.xPos + this.shadowX, this.yPos + this.shadowY + this.spacing * 2);
		ctx.fillStyle = this.fontColor;
		ctx.fillText("Miners: " + this.star.miners, this.xPos, this.yPos + this.spacing * 2);
		//ctx.strokeText("Miners: " + this.star.miners, this.xPos, this.yPos + this.spacing * 2);
	    ctx.textAlign = "left";
	    
		}
    }

    
    dispatcher.addListener( "OpenPlanetMenu", this );
    this.onOpenPlanetMenu = function( e ) {
	this.active = false;
    }

    dispatcher.addListener("ShowPlanetButton", this);
    this.onShowPlanetButton = function(e) {
	this.active = true;
    }

    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
    }
    this.requestUpdate();
}
solarInfoPanel.prototype = new View;
