var UnitTypes = new Array();
var BattleUnitTemplate = function( typeName, level, hp, att, def, spd, 
				   price, dmgMax, dmgMin, production, value,
				   image, imageOnSelect ) {
    this.image = image;
    this.imageOnSelect = imageOnSelect;
    this.type = typeName;
    this.level = level;
    this.hp = hp;
    this.att = att;
    this.def = def;
    this.spd = spd;
    this.price = price;
    this.dmgMax = dmgMax;
    this.dmgMin = dmgMin;
    this.production = production;
    /// For AI:
    this.value = value;
    this.archer = false;
    this.armor = 0;
    this.setArcher = function( armor ) {
	this.archer = true;
	this.armor = armor;
    }
    this.attackStyle = "ordinary";
    this.setAttackStyle = function( attackStyle ) {
	this.attackStyle = attackStyle;
    }
    UnitTypes.push( this );
}


var Fighter = new BattleUnitTemplate( "Fighter", 1, 
				      3, /// Health
				      2, /// Attack
				      2, /// Defence
				      9, /// spd
				      30, /// price
				      3, /// max damage 
				      1, /// min damage
				      20, /// Production
				      95, /// Value 
				      resources.getResource( "fighterImg" ),
				      resources.getResource( "fighterSelectImg" )
				    );

var Gunboat = new BattleUnitTemplate( "Gunboat", 1, 
				      4, /// Health
				      4, /// Attack
				      4, /// Defence
				      5, /// spd
				      40, /// price
				      2, /// max damage 
				      1, /// min damage
				      16, /// Production
				      66, /// Value
				      resources.getResource( "gunboatImg" ),
				      resources.getResource( "gunboatSelectImg" )
				    );
Gunboat.setArcher(8);

var Warship = new BattleUnitTemplate( "Warship", 2, 
				      25, /// Health
				      9, /// Attack
				      9, /// Defence
				      9, /// spd
				      240, /// price
				      6, /// max damage 
				      3, /// min damage
				      7, /// Production
				      448, /// Value
				      resources.getResource( "warshipImg" ),
				      resources.getResource( "warshipSelectImg" )
				    );

var Sniper = new BattleUnitTemplate( "Sniper", 2, 
				     15, /// Health
				     9, /// Attack
				     5, /// Defence
				     7, /// spd
				     225, /// price
				     9, /// max damage 
				     5, /// min damage
				     7, /// Production
				     331, /// Value
				     resources.getResource( "sniperImg" ),
				     resources.getResource( "sniperSelectImg" )
				   );
Sniper.setArcher(24);


var Cruiser = new BattleUnitTemplate( "Cruiser", 3, 
				      90, /// Health
				      15, /// Attack
				      14, /// Defence
				      6, /// spd
				      820, /// price
				      22, /// max damage 
				      18, /// min damage
				      2, /// Production
				      1720, /// Value
				      resources.getResource( "cruiserImg" ),
				      resources.getResource( "cruiserSelectImg" )
				    );


var Warrior = new BattleUnitTemplate( "Warrior", 3, 
				      75, /// Health
				      15, /// Attack
				      13, /// Defence
				      7, /// spd
				      750, /// price
				      20, /// max damage 
				      10, /// min damage
				      2, /// Production
				      1669, /// Value
				      resources.getResource( "warriorImg" ),
				      resources.getResource( "warriorSelectImg" )
				    );
Warrior.setAttackStyle( "Surounding" );

/*
 * BattleUnit won't get init()
 * unless necessary
 */
var BattleUnit = function( template, quantity, leader ) {
    this.template = template;
    this.curHp = template.hp;
    this.quantity = quantity;
    this.leader = leader;
    this.u = 0;
    this.v = 0;
    this.offset = { x:0, y:0 };
    this.setOffset = function( dx, dy ) {
	this.offset.x = dx;
	this.offset.y = dy;
	this.requestUpdate();
    }
    this.setQuantity = function( num ) {
	this.quantity = num;
    }

    this.setPos = function( u, v ) {
	if ( batMap.setMap( u, v, this ) ) {
	    this.requestUpdate();
	    return true;
	} else {
	    trace ( "[Warning] Invalid setPos() of BattleUnit." );
	    return false;
	}
    }
}
BattleUnit.prototype = new GameObject;


var Commander = function( title, name, group, u ,v  ) {
    /* group:
     * 0 : Player
     * 1 .. n : AI
     */
    this.group = group;
    this.title = title;
    this.name = name;
    this.type = "Commander";

    this.maxLen = 5;
    this.curLen = 0;

    /// Properties
    this.horizon = 1;
    this.level = 1;
    this.maxAP = 4;
    this.AP = 4;
    this.att = 1;
    this.def = 0;
    this.units = new Array();

    
    /// Appearance Parameters
    this.orientation = 0;
    this.path = null;
    this.target = { u:-1, v:-1 };
    
    this.init();
    this.tick = 0;
    this.u = 0;
    this.v = 1;
    
    this.setPos = function( u, v ) {
	if ( univMap.setMap( u, v, this ) ) {
	    this.requestUpdate();
	    if ( 0 == this.group ) {
		univMap.unveilArea( u, v, this.horizon );
	    }
	    return true;
	} else {
	    trace ( "[Warning] Invalid setPos() of Commander." );
	    return false;
	}
    }
    this.restoreAP = function() {
	this.AP = this.maxAP;
	this.requestUpdate();
    }
    this.addUnit = function( template ) {
	for ( var i=0; i<this.units.length; i++ ) {
	    if ( this.units[i].template == template ) {
		this.units[i].quantity++;
		return;
	    }
	}
	this.units.push( new BattleUnit( template, 1, this ) );
    }
    this.setOrientation = function( ort ) {
	this.orientation = ort;
    }
    this.turnRight = function() {
	this.orientation = ( this.orientation + 1 ) % 6;
    }
    this.turnLeft = function() {
	this.orientation = ( this.orientation - 1 ) % 6;
    }
    this.stepForward = function() {
	if ( this.AP <= 0 ) {
	    return false;
	}
	if ( this.setPos( this.u + univMap.du[this.orientation],
			  this.v + univMap.dv[this.orientation],
			  this ) ) {
	    this.AP--;
	    return true;
	} else {
	    return false;
	}
    }
    this.update = function() {
	return ;
    }
    this.setAttack = function( att ) {
	this.att = att;
	this.requestUpdate();
    }
    this.setDefence = function( def ) {
	this.def = def;
	this.requestUpdate();
    }
    this.updatePath = function() {
	this.path = univMap.floodFill( this.u, this.v, this.target.u, this.target.v );
    }


    /// Coordinates
    this.setPos( u, v );
}
Commander.prototype = new GameObject;

