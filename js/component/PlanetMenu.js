var OpenMenuAnimation = function( m ) {
    this.objs = new Array();
    this.objs.push( m );
    this.lifetime = 200;
    this.tick = 0;
    this.objs[0].curTime = 0;
    this.objs[0].curTime2 = 0;
    this.init();
    this.next = function() {
	if ( 1 == this.objs[0].state ) {
	    this.objs[0].curTime++;
	    if ( this.objs[0].curTime >= this.objs[0].aniTime ) {
		this.objs[0].state = 2;
		dispatcher.broadcast( { name: "ActivateWidgets" } );
		if ( this.objs[0].currentWidgetList == this.objs[0].shipYardWidgets ) {
		    dispatcher.broadcast( { name: "SwitchTab", 
					    tab: "shipyard" } );
		} else {
		    dispatcher.broadcast( { name: "SwitchTab", 
					    tab: "factory" } );
		}

	    }
	} else if ( 3 == this.objs[0].state ) {
	    this.objs[0].curTime2++;
	    if ( this.objs[0].curTime2 >= this.objs[0].aniTime ) {
		this.objs[0].state = 0;
		dispatcher.broadcast( { name: "ShowPlanetButton",
					display: true } );
	    }
	}
	this.objs[0].requestUpdate();
    }
}
OpenMenuAnimation.prototype = new Tween;



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
    this.infoWidget = new planetMenuInfoBox(this.menu2xPos, this.menu2yPos, "planet", this.planetName, this.playerName, this.commanderName, this.planetStructures);
    this.widgets.push(new planetMenuExitButton("Exit", this.menu1xPos + 190, this.menu1yPos + 580));
    this.creditWidget = new planetMenuCredits("Credits: ", this.menu1xPos, this.menu1yPos + 520, this.playerMoney);
    
    this.shipYardWidgets.push(new planetMenuButton("Fighter                      "+ Fighter.price, this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing, "fighter", Fighter.price, "shipyard" ));
    this.shipYardWidgets.push(new planetMenuButton("Gunboat                    "+Gunboat.price, this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 2, "gunboat", Gunboat.price, "shipyard" ));
    this.shipYardWidgets.push(new planetMenuButton("Warship                   "+Warship.price, this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 3, "warship", Warship.price, "shipyard" ));
    this.shipYardWidgets.push(new planetMenuButton("Sniper                       "+Sniper.price, this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 4, "sniper", Sniper.price, "shipyard" ));
    this.shipYardWidgets.push(new planetMenuButton("Cruiser                   "+Cruiser.price, this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 5, "cruiser", Cruiser.price, "shipyard" ));
    this.shipYardWidgets.push(new planetMenuButton("Warrior                  "+Warrior.price, this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 6, "warrior", Warrior.price, "shipyard" ));
    this.shipYardWidgets.push(new planetMenuButton("Miner                          50", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 7, "miner", 50, "shipyard" ));
    
    this.factoryWidgets.push(new planetMenuButton("ShipYard                      50", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing, "shipyard", 50, "factory" ));
    this.factoryWidgets.push(new planetMenuButton("Defense System         0", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 2, "defensesystem", 0, "factory" ));
    this.factoryWidgets.push(new planetMenuButton("Refinery                       0", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 3, "refinery", 0, "factory" ));
    this.factoryWidgets.push(new planetMenuButton("Fusion Power Plant   0", this.menu1xPos,this.menu1yPos + this.buttonStartY + this.buttonSpacing * 4, "powerplant",0, "factory" ));
    dispatcher.broadcast( { name: "DisactivateWidgets" } );
    
    
    
    var that = this;
    this.draw = function( ctx ) {
	if ( ctx == ctxMenu ) {
	    ctx.lineWidth = defaultLineWidth;
	    ctx.textAlign = defaultTextAlign;
	    ctx.textBaseline = defaultTextBaseline;
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
		that.creditWidget.draw(ctx);
		that.infoWidget.draw(ctx);
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
		
		
	    }
	}
    }
    
    that.drawBackground = function(ctx) {
	ctx.fillStyle = "rgba(255,255,255,0.5)";
	ctx.fillRect(that.menu1xPos - 20, that.menu1yPos + 20, 300, 450);
	
	ctx.fillRect(that.menu2xPos, that.menu1yPos + 220, 290, 330);
	
    }
    
    dispatcher.addListener("OpenPlanetMenu", this);
    this.onOpenPlanetMenu = function(e) {
	that.state = 1;
	that.creditWidget.money = e.force.gold;
	that.infoWidget.updatePlanetInfo(e.planet.planetInfo.name, e.planet.planetInfo.structureList, e.force.name, e.commander.name);
	new OpenMenuAnimation( this );
    }
    
    
    
    dispatcher.addListener("ExitPlanetMenu", this);
    this.onExitPlanetMenu = function(e) {
	if (e.exit == true) {
	    if (that.state == 2) {
		that.state = 3;
		dispatcher.broadcast( { name: "DisactivateWidgets" } );
		dispatcher.broadcast( { name: "ShowPlanetButton",
					display: true } );
		/*
		for (var i = 0; i < that.currentWidgetList.length; i++) {
		    that.currentWidgetList[i].active = false;
		}
		for (var i = 0; i < that.tabWidgets.length; i++) {
		    that.tabWidgets[i].active = false;
		}
		*/
	    }
	}
    }
    
    dispatcher.addListener( "SwitchTab", this );
    this.onSwitchTab = function( e ) {
	//trace(e.tab);
	if (e.tab == "shipyard") {
	    that.currentWidgetList = that.shipYardWidgets;
	    that.tabWidgets[0].selected = false;
	}
	else if (e.tab == "factory") {
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

var planetMenuButton = function(name, xPos, yPos, updateName, cost, tab ) {
    this.register( solarSystem );
    this.tab = tab;
    this.force = null;
    this.cost = cost;
    this.xPos = xPos;
    this.yPos = yPos;
    this.name = name;
    this.quant = 1;
    this.updateName = updateName;
    this.highlighted = false;
    this.active = false;
    var that = this;
    this.shadowDist = 2;
    this.color = "#FFFFFF";
    this.color2 = "rgba(220,0,0,0.9)";
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
	if ( ctx == ctxMenu && this.active) {
	    var originalColor = ctx.fillStyle;
	    var originalFont = ctx.font;
	    if (that.highlighted) {
		that.drawHighlight(ctx);
	    } else {
	    
	    }
	    ctx.font = that.font;
	    ctx.fillStyle = that.shadowColor;
	    ctx.fillText(that.name, that.xPos + that.shadowDist, that.yPos + that.shadowDist);
	
	    if (that.cost <= that.force.gold && that.quant > 0) {
		ctx.fillStyle = that.color;
	    }
	    else {
		ctx.fillStyle = that.color2;
	    }
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


    dispatcher.addListener( "DisactivateWidgets", this );
    this.onDisactivateWidgets = function( e ) {
	this.active = false;
	this.requestUpdate();
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
    
    this.onLeftMouseDown = function( x, y ) {
	if ( that.active ) {
	    
	    dispatcher.broadcast( { name: "PlanetMenuAction",
				    type: that.updateName,
				    cost: that.cost } );

	}
    }

    this.onMouseMove = function( x, y ) {
	if (that.active) {
	    that.highlighted = true;
	    dispatcher.broadcast( { name: "UpdateSubMenu",
				    type: that.updateName,
				    amount: that.quant} );
	}
	
    }


    dispatcher.addListener( "SwitchTab", this );
    this.onSwitchTab = function( e ) {
	if ( e.tab == this.tab ) {
	    this.active = true;
	    this.requestUpdate();
	} else {
	    this.active = false;
	    this.requestUpdate();
	}
    }
    

    this.onRollOut = function( x, y ) {
	if ( that.active ) {
	    if (that.highlighted == true) {
		dispatcher.broadcast( { name: "UpdateSubMenu",
					type: "planet"} );
		that.highlighted = false;
	    }
	}
    }
    
    this.hitTest = function( x, y ) {
	//trace("testing button" );
	if ( x < that.xPos + that.buttonWidth + that.xOffset && x > that.xPos + that.xOffset &&
	     y < that.yPos + that.buttonHeight + that.yOffset && y > that.yPos + that.yOffset) {
	    return true;
	}
	else {
	    return false;
	}
    }
    
    dispatcher.addListener("OpenPlanetMenu", this);
    this.onOpenPlanetMenu = function(e) {
	that.force = e.force;
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
    }
    this.requestUpdate();
}
planetMenuButton.prototype = new View;

var planetMenuExitButton = function(name, xPos, yPos) {
    this.register(solarSystem);
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
	if ( ctx == ctxMenu && this.active) {
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

    dispatcher.addListener( "ActivateWidgets", this );
    this.onActivateWidgets = function( e ) {
	this.active = true;
	this.requestUpdate();
    }

    dispatcher.addListener( "DisactivateWidgets", this );
    this.onDisactivateWidgets = function( e ) {
	this.active = false;
	this.requestUpdate();
    }
    
    this.onLeftMouseDown = function( x,y ) {
	if (that.active) {
	    trace("exit requested");
	    dispatcher.broadcast( { name: "ExitPlanetMenu",
				    exit: true } );
	}
    }

    this.onMouseMove = function( e ) {
	if (that.active) {
	    that.highlighted = true;

	}
    }

    this.onRollOut = function( x, y ) {
	if ( that.active ) {
	    this.highlighted = false;
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
planetMenuExitButton.prototype = new View;


var planetMenuTabButton = function(name, xPos, yPos, updateName) {
    this.register(solarSystem);
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
	if ( ctx == ctxMenu && this.active) {
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
    }





    dispatcher.addListener( "ActivateWidgets", this );
    this.onActivateWidgets = function( e ) {
	this.active = true;
	this.requestUpdate();
    }

    dispatcher.addListener( "DisactivateWidgets", this );
    this.onDisactivateWidgets = function( e ) {
	this.active = false;
	this.requestUpdate();
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
    

    this.onLeftMouseDown = function( x, y ) {
	if (that.active) {
	    that.selected = true;
	    dispatcher.broadcast( { name: "SwitchTab",
				    tab: that.updateName} );
	}
    }
    
    this.hitTest = function( x, y ) {
	if ( x < that.xPos + that.buttonWidth + that.xOffset && x > that.xPos + that.xOffset &&
	     y < that.yPos + that.buttonHeight + that.yOffset && y > that.yPos + that.yOffset) {
	    return true;
	} 
	return false;
	/*
	else {
	    
	    that.highlighted = false;
	    //that.requestUpdate();
	}
	*/
    }
    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
    }
    this.requestUpdate();
}
planetMenuTabButton.prototype = new View;

var planetMenuLabel = function(name, font, color, xPos, yPos) {
    this.register( solarSystem );
    this.xPos = xPos;
    this.yPos = yPos;
    this.name = name;
    var that = this;
    this.shadowDist = 2;
    this.color = "#FFFFFF";
    this.shadowColor = "#222222";
    this.font = font;
    this.active = false;


    dispatcher.addListener( "ActivateWidgets", this );
    this.onActivateWidgets = function( e ) {
	this.active = true;
	this.requestUpdate();
    }

    dispatcher.addListener( "DisactivateWidgets", this );
    this.onDisactivateWidgets = function( e ) {
	this.active = false;
	this.requestUpdate();
    }

    
    this.draw = function( ctx ) {
	if ( ctx == ctxMenu && this.active ) {
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
}
planetMenuLabel.prototype = new View;

var planetMenuCredits = function(name, xPos, yPos, credits) {
    this.register( solarSystem );
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
    this.active = false;
    
    dispatcher.addListener( "UpdateCredits", this );
    this.onUpdateCredits = function( e ) {
	that.money = e.value;
    }

    dispatcher.addListener( "ActivateWidgets", this );
    this.onActivateWidgets = function( e ) {
	this.active = true;
	this.requestUpdate();
    }

    dispatcher.addListener( "DisactivateWidgets", this );
    this.onDisactivateWidgets = function( e ) {
	this.active = false;
	this.requestUpdate();
    }

    
    this.draw = function( ctx ) {
	if ( ctx == ctxMenu && this.active ) {
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
}
planetMenuCredits.prototype = new View();


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
    this.fighterInfoText.push("Price:                         30");
    this.fighterInfoText.push("");
    this.fighterInfoText.push("Quantity:                  1");
    this.informationList["fighter"] = this.fighterInfoText;
    this.headerList["fighter"] = "Fighter";
    this.profilePicList["fighter"] = "pmProfilePic";
    
    this.gunboatInfoText = new Array(); 
    this.gunboatInfoText.push("Health:                        4");
    this.gunboatInfoText.push("Attack:                        4");
    this.gunboatInfoText.push("Defence:                     4");
    this.gunboatInfoText.push("Speed:                         5");
    this.gunboatInfoText.push("Price:                         40");
    this.gunboatInfoText.push("");
    this.gunboatInfoText.push("Quantity:                  1");
    this.informationList["gunboat"] = this.gunboatInfoText;
    this.headerList["gunboat"] = "Gunboat";
    this.profilePicList["gunboat"] = "pmProfilePic";

    
    this.warshipInfoText = new Array(); 
    this.warshipInfoText.push("Health:                      25");
    this.warshipInfoText.push("Attack:                        9");
    this.warshipInfoText.push("Defence:                     9");
    this.warshipInfoText.push("Speed:                         9");
    this.warshipInfoText.push("Price:                       240");
    this.warshipInfoText.push("");
    this.warshipInfoText.push("Quantity:                  1");
    this.informationList["warship"] = this.warshipInfoText;
    this.headerList["warship"] = "Warship";
    this.profilePicList["warship"] = "pmProfilePic";

    
    this.sniperInfoText = new Array(); 
    this.sniperInfoText.push("Health:                      15");
    this.sniperInfoText.push("Attack:                        9");
    this.sniperInfoText.push("Defence:                     5");
    this.sniperInfoText.push("Speed:                         7");
    this.sniperInfoText.push("Price:                       225");
    this.sniperInfoText.push("");
    this.sniperInfoText.push("Quantity:                  1");
    this.informationList["sniper"] = this.sniperInfoText;
    this.headerList["sniper"] = "Sniper";
    this.profilePicList["sniper"] = "pmProfilePic";
    
    
    this.cruiserInfoText = new Array(); 
    this.cruiserInfoText.push("Health:                      90");
    this.cruiserInfoText.push("Attack:                      15");
    this.cruiserInfoText.push("Defence:                   14");
    this.cruiserInfoText.push("Speed:                         6");
    this.cruiserInfoText.push("Price:                       820");
    this.cruiserInfoText.push("");
    this.cruiserInfoText.push("Quantity:                  1");
    this.informationList["cruiser"] = this.cruiserInfoText;
    this.headerList["cruiser"] = "Cruiser";
    this.profilePicList["cruiser"] = "pmProfilePic";

    this.warriorInfoText = new Array(); 
    this.warriorInfoText.push("Health:                      75");
    this.warriorInfoText.push("Attack:                      15");
    this.warriorInfoText.push("Defence:                   13");
    this.warriorInfoText.push("Speed:                         7");
    this.warriorInfoText.push("Price:                       750");
    this.warriorInfoText.push("");
    this.warriorInfoText.push("Quantity:                  1");
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
    this.shadowDist = 2;
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
    this.updatePlanetInfo = function(planetName, structures, owner, commander) {
	that.planetInfoText = [];
	that.planetInfoText.push("Owner: " + owner);
	that.planetInfoText.push("Commander: " + commander);
	that.planetInfoText.push("");
	that.planetInfoText.push("Structures:");
	for(var i = 0; i < structures.length; i++) {
	    this.planetInfoText.push("- " + structures[i]);
	}
	this.informationList["planet"] = that.planetInfoText;
	this.headerList["planet"] = planetName;
	//this.profilePicList["planet"] = "pmProfilePic";
	that.headerText = that.headerList["planet"];
	that.information = that.informationList["planet"];
	that.profilePic = that.profilePicList["planet"];
	
    }
    
    
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
	    ctx.fillStyle = that.shadowColor;
	    ctx.fillText(that.information[i], that.xPos + that.infoTextX + that.shadowDist, that.yPos + that.infoTextY + that.shadowDist + (i * that.infoTextSpacing));
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
    this.onUpdateSubMenu= function( e ) {
	that.headerText = that.headerList[e.type];
	that.information = that.informationList[e.type];
	that.profilePic = that.profilePicList[e.type];
	if (e.type == "fighter") {
	    that.informationList["fighter"][that.fighterInfoText.length - 1] = "Quantity:                  " + planetMenu.star.quantities[0];
	}
	else if (e.type == "gunboat") {
	    that.informationList["gunboat"][that.gunboatInfoText.length - 1] = "Quantity:                  " + planetMenu.star.quantities[1];
	}
	else if (e.type == "warship") {
	    that.informationList["warship"][that.warshipInfoText.length - 1] = "Quantity:                  " + planetMenu.star.quantities[2];
	}
	else if (e.type == "sniper") {
	    that.informationList["sniper"][that.sniperInfoText.length - 1] = "Quantity:                  " + planetMenu.star.quantities[3];
	}
	else if (e.type == "cruiser") {
	    that.informationList["cruiser"][that.cruiserInfoText.length - 1] = "Quantity:                  " + planetMenu.star.quantities[4];
	}
	else if (e.type == "warrior") {
	    that.informationList["warrior"][that.warriorInfoText.length - 1] = "Quantity:                  " + planetMenu.star.quantities[5];
	}
	
    }
    
}

var PlanetMenu = function() {
    this.visible = true;
    var that = this;
    this.star = null;
    this.commanderPanel = null;
    this.init();
    

    this.update = function() {
	this.requestUpdate();
    }

    this.requestUpdate();

    
    this.setVisible = function( vis ) {
	this.visible = vis;
	this.requestUpdate();
    }
    this.setVisible( true );
    
    dispatcher.addListener( "EnterSolarSystem", this );
    this.onEnterSolarSystem = function( e ) {
	this.star = e.star;
	this.star.active = true;
	this.commanderPanel = new CommanderInfoPanel( 
	    this.star.visiting,
	    300, 
	    20 );
    }
    var planetMenuHandler = new PlanetMenuHandler();
    var planetMenuView = new PlanetMenuView(this);
}
PlanetMenu.prototype = new GameObject;

var PlanetMenuHandler = function() {
    this.force = null;
    this.commander = null;
    this.ss = null;
    this.star = null;
    var that = this;

    dispatcher.addListener( "EnterSolarSystem", this );
    this.onEnterSolarSystem = function( e ) {
	this.star = e.star;
    }
    
    dispatcher.addListener( "PlanetMenuAction", this );
    this.onPlanetMenuAction = function( e ) {
	if ( e.cost <= forces[this.star.visiting.group].gold ) {
	    if (e.type == "fighter") {
		if ( 0 < this.star.quantities[0] ) {
		    this.star.visiting.addUnit(Fighter);
		    this.star.quantities[0]--;
		    trace( this.star.quantities[0] );
		    forces[this.star.visiting.group].gold -= e.cost;
		    dispatcher.broadcast( { name: "UpdateCredits",
					    value: forces[this.star.visiting.group].gold } );

		    dispatcher.broadcast( { name: "UpdateSubMenu",
					    type: "fighter",
					    amount: this.star.quantities[0] } );
		}
	    }
	    else if (e.type == "gunboat") {
		if ( 0 < this.star.quantities[1] ) {
		    this.star.visiting.addUnit(Gunboat);
		    this.star.quantities[1]--;
		    forces[this.star.visiting.group].gold -= e.cost;
		    dispatcher.broadcast( { name: "UpdateCredits",
					    value: forces[this.star.visiting.group].gold } );

		    dispatcher.broadcast( { name: "UpdateSubMenu",
					    type: "gunship",
					    amount: this.star.quantities[1] } );
		}
	    }
	    else if (e.type == "warship") {
		if ( 0 < this.star.quantities[2] ) {
		    this.star.visiting.addUnit(Warship);
		    this.star.quantities[2]--;
		    forces[this.star.visiting.group].gold -= e.cost;
		    dispatcher.broadcast( { name: "UpdateCredits",
					    value: forces[this.star.visiting.group].gold } );

		    dispatcher.broadcast( { name: "UpdateSubMenu",
					    type: "warship",
					    amount: this.star.quantities[2] } );
		}
	    }
	    else if (e.type == "sniper") {
		if ( 0 < this.star.quantities[3] ) {
		    this.star.visiting.addUnit(Sniper);
		    this.star.quantities[3]--;
		    forces[this.star.visiting.group].gold -= e.cost;
		    dispatcher.broadcast( { name: "UpdateCredits",
					    value: forces[this.star.visiting.group].gold } );

		    dispatcher.broadcast( { name: "UpdateSubMenu",
					    type: "sniper",
					    amount: this.star.quantities[3] } );
		}

	    }
	    else if (e.type == "cruiser") {
		if ( 0 < this.star.quantities[4] ) {
		    this.star.visiting.addUnit(Cruiser);
		    this.star.quantities[4]--;
		    forces[this.star.visiting.group].gold -= e.cost;
		    dispatcher.broadcast( { name: "UpdateCredits",
					    value: forces[this.star.visiting.group].gold } );

		    dispatcher.broadcast( { name: "UpdateSubMenu",
					    type: "cruiser",
					    amount: this.star.quantities[4] } );
		}
	    }
	    else if (e.type == "warrior") {
		if ( 0 < this.star.quantities[5] ) {
		    this.star.visiting.addUnit(Warrior);
		    this.star.quantities[5]--;
		    forces[this.star.visiting.group].gold -= e.cost;
		    dispatcher.broadcast( { name: "UpdateCredits",
					    value: forces[this.star.visiting.group].gold } );

		    dispatcher.broadcast( { name: "UpdateSubMenu",
					    type: "warrior",
					    amount: this.star.quantities[5] } );
		}

	    }
	    else if (e.type == "miner") {

	    }
	    else if (e.type == "shipyard") {
		
	    }
	    else if (e.type == "defensesystem") {
		dispatcher.broadcast( { name: "SetShipQuantity",
					type: "defensesystem",
					quant: 0} );
	    }
	    else if (e.type == "refinery") {
		dispatcher.broadcast( { name: "SetShipQuantity",
					type: "refinery",
					quant: 0} );
	    }
	    else if (e.type == "powerplant") {
		dispatcher.broadcast( { name: "SetShipQuantity",
					type: "powerplant",
					quant: 0} );
	    }
	}
	
    }
}
