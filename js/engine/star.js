var starImage = new Image();
starImage.src = "img/star.png";

var StarSolarView = function( m ) {
    this.setModel( m );
	this.that = this;
    /// Do register a view on stage !!!
    this.register( solarSystem );
    
    this.draw = function()
	{
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
		starfield.draw();
		cam.update();
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
	
	this.onLeftMouseDown = function(x, y)
	{
		console.log("hello");
	}
}
StarSolarView.prototype = new View();

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


function adjustAngle(angle, viewAngle, mouse, distance) {
	var magicNum = 11.37777777 * 3;
	var center = distance / 2;
	return (mouse - center) / magicNum;
	
}

function startRayCheck(planetList, mx, my) {
		var rayLen = 100;
		var position = new Array();
		position[0] = cam.position[0];
		position[1] = cam.position[1];
		position[2] = cam.position[2];
		var rotation = new Array();
		rotation[0] = cam.orientation[0];
		rotation[1] = cam.orientation[1];
		rotation[2] = cam.orientation[2];
		
		rotation[0] = adjustAngle(rotation[0], 90, mx, 1024);
		rotation[1] = adjustAngle(rotation[1], 90 * (3/4), my, 768);
		var rayDir = [position[0] + rayLen * Math.sin(degToRad(rotation[0])) * Math.cos(degToRad(rotation[1])),
						position[1] - rayLen * Math.sin(degToRad(rotation[1])),
						position[2] - rayLen * Math.cos(degToRad(rotation[0])) * Math.cos(degToRad(rotation[1]))];
		console.log("planet1: " + planetList[0].position[0] + " "  + planetList[0].position[1] + " "  + planetList[0].position[2]);
		console.log("ray dirrection: " + rayDir);
		return rayCheck(rayDir, position, planetList);
	}
	
function rayCheck (direction, position, planetList) {
	var rayIter = 500;
	for (var t = 0; t <= 1; t += rayIter) {
		var rx = position[0] + ((direction[0] - position[0]) * t);
		var ry = position[1] + ((direction[1] - position[1]) * t);
		var rz = position[2] + ((direction[2] - position[2]) * t);
		for (var i = 0; i < planetList.length; i++) {
			if (rx >= (planetList[i].position[0] - (planetList[i].radius)) && rx <= (planetList[i].position[0] + (planetList[i].radius))) {
				if (ry >= (planetList[i].position[1] - (planetList[i].radius)) && ry <= (planetList[i].position[1] + (planetList[i].radius))) {
					if (rz >= (planetList[i].position[2] - (planetList[i].radius)) && rz <= (planetList[i].position[2] + (planetList[i].radius))) {
						return planetList[i];
					}
				}
			}
		}
	}
	return null;
}
    


var Star = function(texture, x, y, z, radius) {
	this.visiting = null;
    this.group = 0;
    this.quantities = new Array();
    for ( var i=0; i < UnitTypes.length; i++ ){
		this.quantities[i] = 1;
    }
	this.monthCount = 0;
	this.incomeRate = 20;
    this.position = vec3.create();
	this.position[0] = x;
	this.position[1] = y;
	this.position[2] = z;
    this.radius = 3;//radius;
	this.starModel = new Model("ball.obj", texture);
	this.starModel.setPosition(this.position[0], this.position[1], this.position[2]);
	this.starModel.setScale(this.radius, this.radius, this.radius);
	this.starModel.useLighting(false);
	var that = this;
    /// Add views:
    new StarSolarView( this );
    /*
    this.addView( new StarUniverseView( this ) );
    */
	
    /// do init a game object before using it
    this.init();
    this.active = true;
	this.update = function()
	{
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
	
	var planet2 = new Planet(textures1[Math.floor(Math.random()*textures1.length)], "clouds.png", -8, 0, -20, 1, radii2[0], this, new PlanetInfo(null, "Joe"));
	planet2.orbitVelocity = 0.003 / planet2.orbitRadius;
	this.planets.push(planet2); 
	
	for(var i = 0; i < radii.length; i++)
	{
		var x = Math.random();
		if(x > 0.3) // 50% chance of a planet in each orbit
		{
			var planet = new Planet(textures2[Math.floor(Math.random()*textures2.length)], null, -8, 0, -20, (Math.random() * 1.5) + 0.5, radii[i], this, null);
			planet.orbitVelocity = 0.003 / planet.orbitRadius;
			this.planets.push(planet);
		}
	}
	
	dispatcher.addListener( "MouseMove", this );
	this.onMouseMove = function( e ) {
		
	}
	
	dispatcher.addListener( "NewTurn", this);
	this.onNewTurn = function( e ) {
		forces[that.group].gold += that.miners * that.incomeRate;
		that.monthCount ++;
		if (that.monthCount >= 11) {
			that.monthCount = 0;
			for ( var i=0; i < UnitTypes.length; i++ ){
				that.quantities[i] += UnitTypes[i].production;
			}
		}
	}
	
	this.miners = 1; // number of miners in the system
	var openButton = new planetMenuOpenButton("Open Planet Menu", 50, 670, this);
	var leaveButton = new exitSolarSystemButton("Leave Solar System", 50, 730, this);
	var commanderInfoPanel = new CommanderInfoPanel(50,50,this);
}
Star.prototype = new GameObject();

var planetMenuOpenButton = function(name, xPos, yPos, model) {
		this.setModel(model);
		this.model = model;
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
				ctx.fillText(that.name, that.xPos + that.shadowDist, that.yPos + that.shadowDist);
				
				ctx.fillStyle = that.color;
				ctx.font = that.font;
				if (that.highlighted) {
					ctx.fillText(that.name, that.xPos - 2, that.yPos - 1);
					ctx.strokeStyle = "#000000";
					ctx.strokeText(that.name, that.xPos - 2, that.yPos - 1);
				} else {
					ctx.fillText(that.name, that.xPos, that.yPos);
					ctx.strokeStyle = "#000000";
					ctx.strokeText(that.name, that.xPos, that.yPos, 1);
				}
				
				
				ctx.fillStyle = originalColor;
				ctx.font = originalFont;
			}
		}
		
		dispatcher.addListener( "LeftMouseDown", this );
		this.onLeftMouseDown = function( e ) {
			if (that.active) {
				if (that.hitTest( e.x, e.y ) == true){	
					console.log(that.model.quantities[0]);
					dispatcher.broadcast( { name: "OpenPlanetMenu",
						force: forces[that.model.group],
						commander: forces[0].commanders[0],//that.model.visiting ,
						planet: that.model.planets[0],
						ss: that.model} );
					that.active = false;
				}
			}
		}
		
		dispatcher.addListener("ShowPlanetButton", this);
		this.onShowPlanetButton = function(e) {
			if (e.display == true) {
				that.active = true;
				}
			}
		
		
		dispatcher.addListener( "MouseMove", this );
		this.onMouseMove = function( e ) {
			if (that.active) {
				if (that.hitTest( e.x, e.y ) == true){
					that.highlighted = true;
				}
				else {
					that.highlighted = false;
				}
			}
		}
		
		this.hitTest = function( x, y ) {
			//trace("testing button" );
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
				ctx.fillText(that.name, that.xPos + that.shadowDist, that.yPos + that.shadowDist);
				
				ctx.fillStyle = that.color;
				ctx.font = that.font;
				if (that.highlighted) {
					ctx.fillText(that.name, that.xPos - 2, that.yPos - 1);
					ctx.strokeStyle = "#000000";
					ctx.strokeText(that.name, that.xPos - 2, that.yPos - 1);
				} else {
					ctx.fillText(that.name, that.xPos, that.yPos);
					ctx.strokeStyle = "#000000";
					ctx.strokeText(that.name, that.xPos, that.yPos, 1);
				}
				
				
				ctx.fillStyle = originalColor;
				ctx.font = originalFont;
			}
		}
		
		dispatcher.addListener( "LeftMouseDown", this );
		this.onLeftMouseDown = function( e ) {
			if (that.active) {
				if (that.hitTest( e.x, e.y ) == true){					
					game.setStage( universe );
				}
			}
		}
		
		dispatcher.addListener("OpenPlanetMenu", this);
		this.onOpenPlanetMenu = function(e) {
			that.active = false;
		}
		
		dispatcher.addListener("ShowPlanetButton", this);
		this.onShowPlanetButton = function(e) {
			if (e.display == true) {
				that.active = true;
				}
			}
		
		
		dispatcher.addListener( "MouseMove", this );
		this.onMouseMove = function( e ) {
			if (that.active) {
				if (that.hitTest( e.x, e.y ) == true){
					that.highlighted = true;
				}
				else {
					that.highlighted = false;
				}
			}
		}
		
		this.hitTest = function( x, y ) {
			//trace("testing button" );
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
exitSolarSystemButton.prototype = new View;

var CommanderInfoPanel = function(xPos, yPos, model) {
		this.setModel(model);
		this.model = model;
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
		this.font = "22px Eras Bold ITC"
		this.buttonWidth = 180;
		this.buttonHeight = 250;
		this.xOffset = -17;
		this.yOffset = -30;
		this.lineWidth = 3;
		this.edgeOffset = 10;
		this.infoSpacing = 25;
		
		this.commander = null; //that.model.visiting
		this.fighters = 0; 
		this.gunboats = 0;
		this.warships = 0;
		this.snipers = 0;
		this.cruisers = 0;
		this.warriors = 0;
		
		this.draw = function( ctx ) {
			if (ctx == ctxMenu && that.active) {
				var ctx = ctxMenu;
				var originalColor = ctx.fillStyle;
				var originalFont = ctx.font;
				var originalWidth = ctx.lineWidth;
				
				ctx.beginPath();
				ctx.moveTo(that.xPos + that.buttonWidth + that.xOffset, that.yPos + that.yOffset);
				ctx.lineTo(that.xPos + that.edgeOffset + that.xOffset, that.yPos + that.yOffset);
				ctx.lineTo(that.xPos + that.xOffset, that.yPos + that.edgeOffset + that.yOffset);
				ctx.lineTo(that.xPos + that.xOffset, that.yPos + that.buttonHeight + that.yOffset);
				ctx.lineTo(that.xPos + that.buttonWidth - that.edgeOffset + that.xOffset, that.yPos + that.buttonHeight + that.yOffset);
				ctx.lineTo(that.xPos + that.buttonWidth + that.xOffset, that.yPos + that.buttonHeight - that.edgeOffset + that.yOffset);
				ctx.lineTo(that.xPos + that.buttonWidth + that.xOffset, that.yPos + that.yOffset);
				ctx.closePath();
				
				ctx.strokeStyle = that.strokeStyle;
				ctx.fillStyle = that.highlightColor;
				
				ctx.fill();
				ctx.stroke();
				ctx.lineWidth = originalWidth;
				ctx.font = that.font;
				
				
				
				if (that.commander != null) {
					ctx.fillStyle = that.shadowColor;
					ctx.fillText(that.commander.name, that.xPos + that.shadowDist, that.yPos + that.shadowDist);
					ctx.fillStyle = that.color;
					ctx.font = that.font;
					ctx.fillText(that.commander.name, that.xPos, that.yPos);
					ctx.strokeStyle = "#000000";
					ctx.strokeText(that.commander.name, that.xPos, that.yPos, 1);
					var numItems = 1;
					if (that.fighers != 0) {
						numItems ++;
						ctx.fillStyle = that.shadowColor;
						ctx.fillText("Fighters: " + that.fighters, that.xPos + that.shadowDist, (that.yPos + that.shadowDist + (that.infoSpacing * numItems)));
						ctx.fillStyle = that.color;
						ctx.font = that.font;
						ctx.fillText("Fighters: " + that.fighters, that.xPos, (that.yPos) + (that.infoSpacing * numItems));
						ctx.strokeStyle = "#000000";
						ctx.strokeText("Fighters: " + that.fighters, that.xPos, (that.yPos) + (that.infoSpacing * numItems), 1);
					}
					if (that.gunboats != 0) {
						numItems ++;
						ctx.fillStyle = that.shadowColor;
						ctx.fillText("Gunboats: " + that.gunboats, that.xPos + that.shadowDist, (that.yPos + that.shadowDist + (that.infoSpacing * numItems)));
						ctx.fillStyle = that.color;
						ctx.font = that.font;
						ctx.fillText("Gunboats: " + that.gunboats, that.xPos, (that.yPos) + (that.infoSpacing * numItems));
						ctx.strokeStyle = "#000000";
						ctx.strokeText("Gunboats: " + that.gunboats, that.xPos, (that.yPos) + (that.infoSpacing * numItems), 1);
					}
					if (that.warships != 0) {
						numItems ++;
						ctx.fillStyle = that.shadowColor;
						ctx.fillText("Warships: " + that.warships, that.xPos + that.shadowDist, (that.yPos + that.shadowDist + (that.infoSpacing * numItems)));
						ctx.fillStyle = that.color;
						ctx.font = that.font;
						ctx.fillText("Warships: " + that.warships, that.xPos, (that.yPos) + (that.infoSpacing * numItems));
						ctx.strokeStyle = "#000000";
						ctx.strokeText("Warships: " + that.warships, that.xPos, (that.yPos) + (that.infoSpacing * numItems), 1);
					}
					if (that.snipers != 0) {
						numItems ++;
						ctx.fillStyle = that.shadowColor;
						ctx.fillText("Snipers: " + that.snipers, that.xPos + that.shadowDist, (that.yPos + that.shadowDist + (that.infoSpacing * numItems)));
						ctx.fillStyle = that.color;
						ctx.font = that.font;
						ctx.fillText("Snipers: " + that.snipers, that.xPos, (that.yPos) + (that.infoSpacing * numItems));
						ctx.strokeStyle = "#000000";
						ctx.strokeText("Snipers: " + that.snipers, that.xPos, (that.yPos) + (that.infoSpacing * numItems), 1);
					}
					if (that.cruisers != 0) {
						numItems ++;
						ctx.fillStyle = that.shadowColor;
						ctx.fillText("Cruisers: " + that.cruisers, that.xPos + that.shadowDist, (that.yPos + that.shadowDist + (that.infoSpacing * numItems)));
						ctx.fillStyle = that.color;
						ctx.font = that.font;
						ctx.fillText("Cruisers: " + that.cruisers, that.xPos, (that.yPos) + (that.infoSpacing * numItems));
						ctx.strokeStyle = "#000000";
						ctx.strokeText("Cruisers: " + that.cruisers, that.xPos, (that.yPos) + (that.infoSpacing * numItems), 1);
					}
					if (that.warriors != 0) {
						numItems ++;
						ctx.fillStyle = that.shadowColor;
						ctx.fillText("Warriors: " + that.warriors, that.xPos + that.shadowDist, (that.yPos + that.shadowDist + (that.infoSpacing * numItems)));
						ctx.fillStyle = that.color;
						ctx.font = that.font;
						ctx.fillText("Warriors: " + that.warriors, that.xPos, (that.yPos) + (that.infoSpacing * numItems));
						ctx.strokeStyle = "#000000";
						ctx.strokeText("Warriors: " + that.warriors, that.xPos, (that.yPos) + (that.infoSpacing * numItems), 1);
					}
				}
				
				ctx.fillStyle = originalColor;
				ctx.font = originalFont;
			}
		}
		
		dispatcher.addListener( "UpdateCommanderFleet", this);
		this.onUpdateCommanderFleet = function(e) {
			that.commander = e.commander;
			console.log(that.commander.units.length);
			for (var i = 0; i < that.commander.units.length; i++) {
				if (that.commander.units[i].template == Fighter) {
					that.fighters = that.commander.units[i].quantity;
				}
				else if (that.commander.units[i].template == Gunboat) {
					that.gunboats = that.commander.units[i].quantity;
				}
				else if (that.commander.units[i].template == Warship) {
					that.warships = that.commander.units[i].quantity;
				}
				else if (that.commander.units[i].template == Sniper) {
					that.snipers = that.commander.units[i].quantity;
				}
				else if (that.commander.units[i].template == Cruiser) {
					that.cruisers = that.commander.units[i].quantity;
				}
				else if (that.commander.units[i].template == Warrior) {
					that.warriors = that.commander.units[i].quantity;
				}
			
			}
			
		}
		
		dispatcher.addListener("OpenPlanetMenu", this);
		this.onOpenPlanetMenu = function(e) {
			that.active = false;
		}
		
		dispatcher.addListener("ShowPlanetButton", this);
		this.onShowPlanetButton = function(e) {
			if (e.display == true) {
				that.active = true;
				}
			}
		
	this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
    }
    this.requestUpdate();
}
CommanderInfoPanel.prototype = new View;