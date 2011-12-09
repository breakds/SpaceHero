var PlanetMenuView = function( m ) {
    this.setModel( m );
    this.register( solarSystem );
    this.xPos = 0;
	this.yPos = 0;
	this.widgets = new Array();
	this.shipYardWidgets = new Array();
	this.factoryWidgets = new Array();
	this.tabWidgets = new Array();
	this.menu1xPos = 150;
	this.menu1yPos = 80;
	this.menu2xPos = 605;
	this.menu2yPos = 80;
	
	this.projector1x = -50;
	this.projector1y = 0;
	this.projector2x = 552;
	this.projector2y = 0;
	
	this.buttonSpacing = 45;
	this.buttonStartY = 70;
	
	this.menuReady = false;
	this.aniSpeed = 0.05;
	this.aniSpeed2 = 1.2;
	this.opacity = 0.5;
	this.opacity2 = 0.95;
	
	this.beamHeight = 0;
	this.menuHeight = 0;
	
	this.aniTime = (1 * fps);
	this.curTime = 0;
	this.curTime2 = 0;
	
	this.state = 0;
	this.currentWidgetList;	
	
	// TEMP VARIABLES
	// These should be changed to values passed in and NOT these default values!
	this.planetStructures = new Array();
	this.planetStructures.push("Factory");
	this.planetStructures.push("Ship Yard");
	this.planetStructures.push("Fusion Power Plant");
	
	this.playerMoney = 12345;
	this.playerName = "Player 1";
	this.commanderName = "Taco Bill";
	this.planetName = "Varliswui";
	// end of temp variables
	
	this.tabWidgets.push(new planetMenuTabButton("Factory", this.menu1xPos, this.menu1yPos + 10, "factory"));
	this.tabWidgets.push(new planetMenuTabButton("Ship Yard",this.menu1xPos  + 144, this.menu1yPos + 10, "shipyard"));
	
	this.tabWidgets[0].selected = true;
	this.widgets.push(new planetMenuLabel("Name            Price ", "30px Eras Bold ITC", "#FFFFFF", this.menu1xPos, this.menu1yPos + 55));
	this.widgets.push(new planetMenuLabel("___________________", "30px Eras Bold ITC", "#FFFFFF", this.menu1xPos - 14, this.menu1yPos + 60));
	this.widgets.push(new planetMenuInfoBox(this.menu2xPos, this.menu2yPos, "planet", this.planetName, this.playerName, this.commanderName, this.planetStructures));
	this.widgets.push(new planetMenuExitButton("Exit", this.menu1xPos + 190, this.menu1yPos + 580));
	this.widgets.push(new planetMenuCredits("Credits: ", this.menu1xPos, this.menu1yPos + 520, this.playerMoney));
		
	this.shipYardWidgets.push(new planetMenuButton("Fighter                      90", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing, "fighter"));
	this.shipYardWidgets.push(new planetMenuButton("Gunboat                    66", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 2, "gunboat"));
	this.shipYardWidgets.push(new planetMenuButton("Warship                   448", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 3, "warship"));
	this.shipYardWidgets.push(new planetMenuButton("Sniper                       331", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 4, "sniper"));
	this.shipYardWidgets.push(new planetMenuButton("Cruiser                   1720", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 5, "cruiser"));
	this.shipYardWidgets.push(new planetMenuButton("Warrior                  1669", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 6, "warrior"));
	this.shipYardWidgets.push(new planetMenuButton("Miner                          50", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 7, "miner"));
	
	this.factoryWidgets.push(new planetMenuButton("ShipYard                      50", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing, "shipyard"));
	this.factoryWidgets.push(new planetMenuButton("Defense System         50", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 2, "defensesystem"));
	this.factoryWidgets.push(new planetMenuButton("Refinery                       50", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 3, "refinery"));
	this.factoryWidgets.push(new planetMenuButton("Fusion Power Plant   50", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 4, "powerplant"));
	
	
		
	var that = this;
	this.draw = function( ctx ) {
		if ( ctx == ctxMenu ) {
			
			if (that.state == 2) {
				if (that.opacity < 1.0)
					that.opacity += that.aniSpeed;
				if (that.opacity >= 1) 
					that.opacity = 0.5;
					
				if (that.opacity2 < 1.0)
					that.opacity2 += that.aniSpeed / 8;
				if (that.opacity2 >= 1) 
					that.opacity2 = 0.95;
				
				var originalAlpha = ctx.globalAlpha;
				
				ctx.drawImage(resources.getResource( "projectorLeft" ), 0, 0);
				ctx.drawImage(resources.getResource( "projectorRight" ), 512, 0);
				ctx.globalAlpha = that.opacity;
				ctx.drawImage(resources.getResource( "beamLeft" ), 0, 0);
				ctx.drawImage(resources.getResource( "beamRight" ), 512, 0);
				ctx.globalAlpha = that.opacity2;
				ctx.drawImage(resources.getResource( "planetMenuRight" ), 512, 0);
				ctx.drawImage(resources.getResource( "planetMenuLeft" ), 0, 0);
				that.drawBackground(ctx);
				for (var i = 0; i < that.tabWidgets.length; i++) {
					that.tabWidgets[i].draw(ctx);
				}
				
				for (var i = 0; i < that.widgets.length; i++) {
					that.widgets[i].draw(ctx);
				}
				
				for (var i = 0; i < that.currentWidgetList.length; i++) {
					that.currentWidgetList[i].draw(ctx);
				}
				ctx.globalAlpha = originalAlpha;
			} else if (that.state == 1) {
				if (that.projector1x < 0) {
					that.projector1x += that.aniSpeed2;
				} else if (that.projector1x > 0) {
					that.projector1x = 0;
				}
				if (that.projector2x > 512) {
					that.projector2x -= that.aniSpeed2;
				} else if (that.projector2x > 512) {
					that.projector2x = 512;
				}
				ctx.drawImage(resources.getResource( "projectorLeft" ), that.projector1x, that.projector1y);
				ctx.drawImage(resources.getResource( "projectorRight" ), that.projector2x, that.projector2y);
				if (that.curTime >= that.aniTime/2) {
					
					if (that.beamHeight < resources.getResource("beamLeft").height) {
						that.beamHeight += that.aniSpeed2 * 20;
					}
					else if (that.beamHeight > resources.getResource("beamLeft").height) {
						that.beamHeight = resources.getResource("beamLeft").height;
					}
					
					if (that.menuHeight < resources.getResource("planetMenuLeft").height) {
						that.menuHeight += that.aniSpeed2 * 20;
					}
					else if (that.menuHeight > resources.getResource("planetMenuLeft").height) {
						that.menuHeight = resources.getResource("planetMenuLeft").height;
					}
					ctx.drawImage(resources.getResource("beamLeft"), 0, (resources.getResource("beamLeft").height - that.beamHeight) / 2, resources.getResource("beamLeft").width, that.beamHeight);
					ctx.drawImage(resources.getResource("beamRight"), 512, (resources.getResource("beamRight").height - that.beamHeight) / 2, resources.getResource("beamRight").width, that.beamHeight);
					ctx.drawImage(resources.getResource("planetMenuLeft"), 0, (resources.getResource("planetMenuLeft").height - that.menuHeight) / 2, resources.getResource("planetMenuLeft").width, that.menuHeight);
					ctx.drawImage(resources.getResource("planetMenuRight"), 512, (resources.getResource("planetMenuRight").height - that.menuHeight) / 2, resources.getResource("planetMenuRight").width, that.menuHeight);
				}
				
				that.curTime += 1;
				if (that.curTime >= that.aniTime) {
					that.state = 2;
					that.curTime = 0;
				}
			
			}
			else if (that.state == 3) {
				if (that.curTime2 >= that.aniTime/2) {
					if (that.projector1x > -50) {
						that.projector1x -= that.aniSpeed2;
					} else if (that.projector1x < -50) {
						that.projector1x = -50;
					}
					if (that.projector2x < 562) {
						that.projector2x += that.aniSpeed2;
					} else if (that.projector2x > 562) {
						that.projector2x = 562;
					}
					
				}
				ctx.drawImage(resources.getResource( "projectorLeft" ), that.projector1x, that.projector1y);
				ctx.drawImage(resources.getResource( "projectorRight" ), that.projector2x, that.projector2y);	
				if (that.beamHeight > 0) {
					that.beamHeight -= that.aniSpeed2 * 20;
				}
				else if (that.beamHeight < 0) {
					that.beamHeight = 0;
				}
				
				if (that.menuHeight > 0) {
					that.menuHeight -= that.aniSpeed2 * 20;
				}
				else if (that.menuHeight < 0) {
					that.menuHeight = 0;
				}
				ctx.drawImage(resources.getResource("beamLeft"), 0, (resources.getResource("beamLeft").height - that.beamHeight) / 2, resources.getResource("beamLeft").width, that.beamHeight);
				ctx.drawImage(resources.getResource("beamRight"), 512, (resources.getResource("beamRight").height - that.beamHeight) / 2, resources.getResource("beamRight").width, that.beamHeight);
				ctx.drawImage(resources.getResource("planetMenuLeft"), 0, (resources.getResource("planetMenuLeft").height - that.menuHeight) / 2, resources.getResource("planetMenuLeft").width, that.menuHeight);
				ctx.drawImage(resources.getResource("planetMenuRight"), 512, (resources.getResource("planetMenuRight").height - that.menuHeight) / 2, resources.getResource("planetMenuRight").width, that.menuHeight);
				
				
				that.curTime2 += 1;
				if (that.curTime2 >= that.aniTime) {
					that.state = 0;
					that.curTime2 = 0;
				}
			}
		}
	}
	
	that.drawBackground = function(ctx) {
		ctx.fillStyle = "rgba(255,255,255,0.5)";
		ctx.fillRect(that.menu1xPos - 20, that.menu1yPos + 20, 300, 450);
		
		ctx.fillRect(that.menu2xPos, that.menu1yPos + 220, 290, 330);
	
	}
	
	dispatcher.addListener( "KeyUp", this );
	this.onKeyUp = function( e ) {
			
			if (e.key == 77) {
				if (that.state == 0) {
					console.log("request recieved");
					that.state = 1;
				}
				else if (that.state == 2){ 
					that.state = 3;
				}
			}
	}
	
	dispatcher.addListener("OpenPlanetMenu", this);
	this.onOpenPlanetMenu = function(e) {
		that.playerMoney = e.force.gold;
		this.playerName = e.force.name;
		this.commanderName = e.commander.name;
		this.planetName = e.planet.name;
	}
	
	dispatcher.addListener("ExitPlanetMenu", this);
	this.onExitPlanetMenu = function(e) {
		if (e.exit == true) {
			if (that.state == 2) {
				that.state = 3;
			}
		}
	}
	
	dispatcher.addListener( "SwitchTab", this );
	this.onSwitchTab = function( e ) {
		//trace(e.tab);
		if (e.tab == "shipyard") {
			for (var i = 0; i < that.factoryWidgets.length; i++) {
					that.factoryWidgets[i].active = false;
				}
			for (var i = 0; i < that.shipYardWidgets.length; i++) {
					that.shipYardWidgets[i].active = true;
				}
			that.currentWidgetList = that.shipYardWidgets;
			that.tabWidgets[0].selected = false;
		}
		else if (e.tab == "factory") {
			for (var i = 0; i < that.factoryWidgets.length; i++) {
					that.factoryWidgets[i].active = true;
				}
			for (var i = 0; i < that.shipYardWidgets.length; i++) {
					that.shipYardWidgets[i].active = false;
				}
			that.currentWidgetList = that.factoryWidgets;
			that.tabWidgets[1].selected = false;
		}
	}

    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
    }
	dispatcher.broadcast( { name: "SwitchTab",
				tab: "factory" } );
    this.requestUpdate();
}
PlanetMenuView.prototype = new View;

var planetMenuButton = function(name, xPos, yPos, updateName) {
		//this.register(universe);
		this.xPos = xPos;
		this.yPos = yPos;
		this.name = name;
		this.updateName = updateName;
		this.highlighted = false;
		this.active = false;
		var that = this;
		this.shadowDist = 2;
		this.color = "#FFFFFF";
		this.shadowColor = "#222222";
		this.highlightColor = "rgba(0,0,0,0.2)";
		this.highlightColor2 = "rgba(0,0,0,1)";
		//this.font = "28px Arial Black";
		this.font = "22px Eras Bold ITC";
		this.buttonWidth = 290;
		this.buttonHeight = 40;
		this.xOffset = -17;
		this.yOffset = -30;
		this.lineWidth = 3;
		this.lineHeight = 3;
		
		this.draw = function( ctx ) {
			var originalColor = ctx.fillStyle;
			var originalFont = ctx.font;
			if (that.highlighted) {
				that.drawHighlight(ctx);
			} else {
			
			}
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
		
		this.drawHighlight = function( ctx ) {
			ctx.fillStyle = that.highlightColor;
			ctx.fillRect(that.xPos + that.xOffset, that.yPos + that.yOffset, that.buttonWidth, that.buttonHeight);
			ctx.fillStyle = that.highlightColor2;
			ctx.fillRect(that.xPos + that.xOffset, that.yPos + that.yOffset, that.lineWidth, that.buttonHeight);
			ctx.fillRect(that.xPos + that.xOffset + that.buttonWidth, that.yPos + that.yOffset, that.lineWidth, that.buttonHeight);
			ctx.beginPath();
			ctx.closePath();
			ctx.strokeStyle = that.highlightColor2;
			ctx.stroke();

		}
		
		
		dispatcher.addListener( "MouseMove", this );
		this.onMouseMove = function( e ) {
			if (that.active) {
				that.hitTest( e.x, e.y );
			}
		}
		
		this.hitTest = function( x, y ) {
			//trace("testing button" );
			if ( x < that.xPos + that.buttonWidth + that.xOffset && x > that.xPos + that.xOffset &&
				 y < that.yPos + that.buttonHeight + that.yOffset && y > that.yPos + that.yOffset) {
					
					 that.highlighted = true;
					 dispatcher.broadcast( { name: "UpdateSubMenu",
						type: that.updateName} );
				
			} else {
				if (that.highlighted == true) {
					 dispatcher.broadcast( { name: "UpdateSubMenu",
						type: "planet"} );
					that.highlighted = false;
				}
				
				
			}
		}
	this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
    }
    this.requestUpdate();
}


var planetMenuExitButton = function(name, xPos, yPos) {
		//this.register(universe);
		this.xPos = xPos;
		this.yPos = yPos;
		this.name = name;
		this.highlighted = false;
		this.active = true;
		var that = this;
		this.shadowDist = 2;
		this.color = "#FFFFFF";
		this.shadowColor = "#222222";
		this.highlightColor = "rgba(255,255,255,0.2)";
		this.highlightColor2 = "rgba(0,0,0,0.2)";
		this.strokeStyle = "rgba(50,50,200, 0.5)";
		this.strokeStyle2 = "rgba(50,50,200, 0.7)";
		this.font = "28px Eras Bold ITC"
		this.buttonWidth = 100;
		this.buttonHeight = 40;
		this.xOffset = -17;
		this.yOffset = -30;
		this.lineWidth = 3;
		this.edgeOffset = 10;
		
		this.draw = function( ctx ) {
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
		
		this.drawHighlight = function( ctx ) {
			ctx.fillStyle = that.highlightColor;
			ctx.fillRect(that.xPos + that.xOffset, that.yPos + that.yOffset, that.buttonWidth, that.buttonHeight);
			ctx.fillStyle = that.highlightColor2;
			ctx.fillRect(that.xPos + that.xOffset, that.yPos + that.yOffset, that.lineWidth, that.buttonHeight);
			ctx.fillRect(that.xPos + that.xOffset + that.buttonWidth, that.yPos + that.yOffset, that.lineWidth, that.buttonHeight);
			ctx.beginPath();
			ctx.closePath();
			ctx.strokeStyle = that.highlightColor2;
			ctx.stroke();

		}
		
		dispatcher.addListener( "LeftMouseDown", this );
		this.onLeftMouseDown = function( e ) {
			if (that.active) {
				if (that.hitTest( e.x, e.y ) == true){
					trace("exit requested");
					dispatcher.broadcast( { name: "ExitPlanetMenu",
						exit: true } );
				}
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


var planetMenuTabButton = function(name, xPos, yPos, updateName) {
		//this.register(universe);
		this.xPos = xPos;
		this.yPos = yPos;
		this.name = name;
		this.updateName = updateName;
		this.highlighted = false;
		this.active = true;
		var that = this;
		this.shadowDist = 2;
		this.color = "#FFFFFF";
		this.shadowColor = "#222222";
		this.highlightColor = "rgba(255,255,255,1.0)";
		//this.font = "28px Arial Black";
		this.font = "24px Eras Bold ITC"
		this.buttonWidth = 120;
		this.buttonHeight = 40;
		this.xOffset = -2;
		this.yOffset = -30;
		this.yOffset2 = 10;
		this.thickness = 18;
		this.selected = false;
		
		this.draw = function( ctx ) {
			var originalColor = ctx.fillStyle;
			var originalFont = ctx.font;
			if (that.highlighted) {
				
			} 
			if (that.selected) {
				that.drawHighlight(ctx);
			}
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
		
		this.drawHighlight = function( ctx ) {
			ctx.fillStyle = that.highlightColor;
			ctx.globalAlpha = 0.4;
			ctx.beginPath();
			ctx.strokeStyle = "#000000";

			ctx.moveTo(that.xPos + that.xOffset - that.thickness, that.yPos + that.yOffset2);
			ctx.lineTo(that.xPos + that.xOffset, that.yPos - that.buttonHeight + that.yOffset2);
			ctx.lineTo(that.xPos + that.xOffset + that.buttonWidth, that.yPos - that.buttonHeight + that.yOffset2);
			ctx.lineTo(that.xPos + that.xOffset + that.buttonWidth + that.thickness, that.yPos + that.yOffset2);
			ctx.lineTo(that.xPos + that.xOffset - that.thickness, that.yPos + that.yOffset2);
			ctx.closePath();
			ctx.globalAlpha = 1.0;
			ctx.fillStyle = "rgba(255,255,255,0.5)";
			ctx.fill();
			
		}
		
		dispatcher.addListener( "LeftMouseDown", this );
		this.onLeftMouseDown = function( e ) {
			if (that.active) {
				that.hitTest( e.x, e.y );
			}
		}
		
		this.hitTest = function( x, y ) {
			if ( x < that.xPos + that.buttonWidth + that.xOffset && x > that.xPos + that.xOffset &&
				 y < that.yPos + that.buttonHeight + that.yOffset && y > that.yPos + that.yOffset) {
					
					 that.selected = true;
					 dispatcher.broadcast( { name: "SwitchTab",
						tab: that.updateName} );
				
			} else {
				
				that.highlighted = false;
				//that.requestUpdate();
			}
		}
	this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
    }
    this.requestUpdate();
}

var planetMenuLabel = function(name, font, color, xPos, yPos) {
		this.xPos = xPos;
		this.yPos = yPos;
		this.name = name;
		var that = this;
		this.shadowDist = 2;
		this.color = "#FFFFFF";
		this.shadowColor = "#222222";
		this.font = font;
		
		this.draw = function( ctx ) {
			var originalColor = ctx.fillStyle;
			var originalFont = ctx.font;
			ctx.font = that.font;
			ctx.fillStyle = that.shadowColor;
			ctx.fillText(that.name, that.xPos + that.shadowDist, that.yPos + that.shadowDist);
			
			ctx.fillStyle = that.color;
			ctx.fillText(that.name, that.xPos, that.yPos);
			ctx.strokeStyle = "#000000";
			ctx.strokeText(that.name, that.xPos, that.yPos);
			ctx.fillStyle = originalColor;
			ctx.font = originalFont;
		}
}

var planetMenuCredits = function(name, xPos, yPos, credits) {
		this.xPos = xPos;
		this.yPos = yPos;
		this.width = 300;
		this.height = 50;
		this.name = name;
		var that = this;
		this.shadowDist = 2;
		this.color = "#FFFFFF";
		this.shadowColor = "#222222";
		this.backgroundColor = "rgba(255,255,255,0.5)";
		this.font = "22px Eras Bold ITC";
		this.xOffset = -20;
		this.yOffset = -35;
		this.money = credits;
		
		this.draw = function( ctx ) {
			var originalColor = ctx.fillStyle;
			var originalFont = ctx.font;
			ctx.font = that.font;
			ctx.fillStyle = that.backgroundColor;
			ctx.fillRect(that.xPos + that.xOffset, that.yPos + that.yOffset, that.width, that.height);
			ctx.fillStyle = that.shadowColor;
			ctx.fillText(that.name + that.money, that.xPos + that.shadowDist, that.yPos + that.shadowDist);
			
			ctx.fillStyle = that.color;
			ctx.fillText(that.name + that.money, that.xPos, that.yPos);
			ctx.strokeStyle = "#000000";
			ctx.strokeText(that.name + that.money, that.xPos, that.yPos);
			ctx.fillStyle = originalColor;
			ctx.font = originalFont;
		}
}

var planetMenuInfoBox = function(xPos, yPos, type, planetName, ownerName, commanderName, planetStructures) {
		this.informationList = new Array();
		this.headerList = new Array();
		this.profilePicList = new Array();
		this.planetInfoText = new Array();
		this.planetInfoText.push("Owner: " + ownerName);
		this.planetInfoText.push("Commander: " + commanderName);
		this.planetInfoText.push("");
		this.planetInfoText.push("Structures:");
		for(var i = 0; i < planetStructures.length; i++) {
			this.planetInfoText.push("- " + planetStructures[i]);
		}
		this.informationList["planet"] = this.planetInfoText;
		this.headerList["planet"] = planetName;
		this.profilePicList["planet"] = "pmProfilePic";
		
		this.fighterInfoText = new Array(); 
		this.fighterInfoText.push("Health:                        3");
		this.fighterInfoText.push("Attack:                        2");
		this.fighterInfoText.push("Defence:                     2");
		this.fighterInfoText.push("Speed:                         9");
		this.fighterInfoText.push("Production:             20");
		this.fighterInfoText.push("Price:                         30");
		this.informationList["fighter"] = this.fighterInfoText;
		this.headerList["fighter"] = "Fighter";
		this.profilePicList["fighter"] = "pmProfilePic";
	
		this.gunboatInfoText = new Array(); 
		this.gunboatInfoText.push("Health:                        4");
		this.gunboatInfoText.push("Attack:                        4");
		this.gunboatInfoText.push("Defence:                     4");
		this.gunboatInfoText.push("Speed:                         5");
		this.gunboatInfoText.push("Production:             16");
		this.gunboatInfoText.push("Price:                         40");
		this.informationList["gunboat"] = this.gunboatInfoText;
		this.headerList["gunboat"] = "Gunboat";
		this.profilePicList["gunboat"] = "pmProfilePic";

						
		this.warshipInfoText = new Array(); 
		this.warshipInfoText.push("Health:                      25");
		this.warshipInfoText.push("Attack:                        9");
		this.warshipInfoText.push("Defence:                     9");
		this.warshipInfoText.push("Speed:                         9");
		this.warshipInfoText.push("Production:               7");
		this.warshipInfoText.push("Price:                       240");
		this.informationList["warship"] = this.warshipInfoText;
		this.headerList["warship"] = "Warship";
		this.profilePicList["warship"] = "pmProfilePic";

	
		this.sniperInfoText = new Array(); 
		this.sniperInfoText.push("Health:                      15");
		this.sniperInfoText.push("Attack:                        9");
		this.sniperInfoText.push("Defence:                     5");
		this.sniperInfoText.push("Speed:                         7");
		this.sniperInfoText.push("Production:               7");
		this.sniperInfoText.push("Price:                       225");
		this.informationList["sniper"] = this.sniperInfoText;
		this.headerList["sniper"] = "Sniper";
		this.profilePicList["sniper"] = "pmProfilePic";
		
						
		this.cruiserInfoText = new Array(); 
		this.cruiserInfoText.push("Health:                      90");
		this.cruiserInfoText.push("Attack:                      15");
		this.cruiserInfoText.push("Defence:                   14");
		this.cruiserInfoText.push("Speed:                         6");
		this.cruiserInfoText.push("Production:               2");
		this.cruiserInfoText.push("Price:                       820");
		this.informationList["cruiser"] = this.cruiserInfoText;
		this.headerList["cruiser"] = "Cruiser";
		this.profilePicList["cruiser"] = "pmProfilePic";

		this.warriorInfoText = new Array(); 
		this.warriorInfoText.push("Health:                      75");
		this.warriorInfoText.push("Attack:                      15");
		this.warriorInfoText.push("Defence:                   13");
		this.warriorInfoText.push("Speed:                         7");
		this.warriorInfoText.push("Production:               2");
		this.warriorInfoText.push("Price:                       750");
		this.informationList["warrior"] = this.warriorInfoText;
		this.headerList["warrior"] = "Warrior";
		this.profilePicList["warrior"] = "pmProfilePic";
		
		this.minerInfoText = new Array(); 
		this.minerInfoText.push("Miners are weak ships");
		this.minerInfoText.push("that can mine");
		this.minerInfoText.push("resources from planets");
		this.minerInfoText.push("with avalible minerals.");
		this.minerInfoText.push("Mining resources is");
		this.minerInfoText.push("your main source of");
		this.minerInfoText.push("income.");
		this.informationList["miner"] = this.minerInfoText;
		this.headerList["miner"] = "Miner";
		this.profilePicList["miner"] = "pmProfilePic";
		
		this.shipyardInfoText = new Array(); 
		this.shipyardInfoText.push("The shipyard allows");
		this.shipyardInfoText.push("you to build starships");
		this.shipyardInfoText.push("through the Ship Yard");
		this.shipyardInfoText.push("menu.");
		this.informationList["shipyard"] = this.shipyardInfoText;
		this.headerList["shipyard"] = "Shipyard";
		this.profilePicList["shipyard"] = "pmProfilePic";
		
		this.defenseInfoText = new Array(); 
		this.defenseInfoText.push("The planetary defense");
		this.defenseInfoText.push("system helps you");
		this.defenseInfoText.push("protect your solar");
		this.defenseInfoText.push("system from enemy");
		this.defenseInfoText.push("invaders. All of your ");
		this.defenseInfoText.push("starships in the solar");
		this.defenseInfoText.push("system with a");
		this.defenseInfoText.push("planetary defense");
		this.defenseInfoText.push("system get a boost in");
		this.defenseInfoText.push("defense.");
		this.informationList["defensesystem"] = this.defenseInfoText;
		this.headerList["defensesystem"] = "Defense System";
		this.profilePicList["defensesystem"] = "pmProfilePic";
		
		this.refineryInfoText = new Array(); 
		this.refineryInfoText.push("The refinery allows you");
		this.refineryInfoText.push("to process your mined");
		this.refineryInfoText.push("minerals more");
		this.refineryInfoText.push("efficiently .Thus your");
		this.refineryInfoText.push("income is increased");
		this.refineryInfoText.push("by 10%.");
		this.informationList["refinery"] = this.refineryInfoText;
		this.headerList["refinery"] = "Refinery";
		this.profilePicList["refinery"] = "pmProfilePic";
		
		this.powerplantInfoText = new Array(); 
		this.powerplantInfoText.push("The fusion power plant");
		this.powerplantInfoText.push("provides your");
		this.powerplantInfoText.push("ship yard with cheap");
		this.powerplantInfoText.push("and efficient energy");
		this.powerplantInfoText.push("which allows you to");
        this.powerplantInfoText.push("build ships 10% faster.");
		this.informationList["powerplant"] = this.powerplantInfoText;
		this.headerList["powerplant"] = "Fusion Power Plant";
		this.profilePicList["powerplant"] = "pmProfilePic";
		
		this.xPos = xPos;
		this.yPos = yPos;
		this.headerText = this.headerList[type];
		var that = this;
		this.shadowDist = 3;
		this.profilePic = this.profilePicList[type];
		this.information = this.informationList[type];
		this.color = "#FFFFFF";
		this.shadowColor = "#222222";
		this.headerFont = "28px Eras Bold ITC";
		this.infoFont = "23px Eras Bold ITC";
		this.profilePicX = this.xPos;
		this.profilePicY = this.yPos + 20;
		this.headerTextX = 270;
		this.headerTextY = 0;
		this.infoTextX = 10;
		this.infoTextY = 260;
		this.infoTextSpacing = 30;
		
		//this.headerList["planet"] = "Planet Name";
		//trace(this.headerText);
		
		
		
		this.draw = function( ctx ) {
			var originalColor = ctx.fillStyle;
			var originalFont = ctx.font;
			ctx.textAlign = "right";
			ctx.font = that.headerFont;
			ctx.fillStyle = that.shadowColor;
			ctx.fillText(that.headerText, that.xPos + that.headerTextX + that.shadowDist, that.yPos + that.headerTextY + that.shadowDist);
			
			ctx.fillStyle = that.color;
			ctx.fillText(that.headerText, that.xPos + that.headerTextX, that.yPos + that.headerTextY);
			ctx.strokeStyle = "#000000";
			ctx.strokeText(that.headerText, that.xPos + that.headerTextX, that.yPos + that.headerTextY);
			ctx.textAlign = "left";
			//trace(that.profilePicX + " " + that.profilePicY);
			ctx.drawImage(resources.getResource(that.profilePic), that.profilePicX, that.profilePicY);
			
			ctx.font = that.infoFont;
			
			ctx.lineWidth = 1.2;
			for (var i = 0; i < that.information.length; i++) {
				//ctx.fillStyle = that.shadowColor;
				//ctx.fillText(that.information[i], that.xPos + that.infoTextX + that.shadowDist, that.yPos + that.infoTextY + that.shadowDist + (i * that.infoTextSpacing));
				ctx.fillStyle = that.color;
				ctx.fillText(that.information[i], that.xPos + that.infoTextX, that.yPos + that.infoTextY + (i * that.infoTextSpacing));
				ctx.strokeStyle = "#000000";
				ctx.strokeText(that.information[i], that.xPos + that.infoTextX, that.yPos + that.infoTextY + (i * that.infoTextSpacing));
			}
			ctx.lineWidth = 1;
			ctx.fillStyle = originalColor;
			ctx.font = originalFont;
			
			
		}
		
		dispatcher.addListener( "UpdateSubMenu", this );
		this.onUpdateSubMenu= function(e) {
			that.headerText = that.headerList[e.type];
			that.information = that.informationList[e.type];
			that.profilePic = that.profilePicList[e.type];
			
		}
		
}

var PlanetMenu = function() {
	this.visible = true;
	var that = this;
	this.init();
    this.update = function() {
		if (that.visible) {
			dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
		}
		
		return ;
    }


    var planetMenuView = new PlanetMenuView(this);
}
PlanetMenu.prototype = new GameObject;