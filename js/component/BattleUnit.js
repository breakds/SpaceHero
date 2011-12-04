var UnitTypes = new Array();
var BattleUnitTemplate = function( typeName, level, hp, att, def, spd, 
				   price, dmgMax, dmgMin, production, value ) {
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
				      95 /// Value 
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
				      66 /// Value
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
				      448 /// Value
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
				     331 /// Value
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
				      1720 /// Value
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
				      1669 /// Value
				    );
Warrior.setAttackStyle( "Surounding" );

/*
 * BattleUnit won't get init()
 * unless necessary
 */
var BattleUnit = function( template ) {
    this.template = template;
    this,curHp = template.hp;
    this.quantity = 1;
    this.setQuantity = function( num ) {
	this.quantity = num;
    }
}
BattleUnit.prototype = new GameObject;


var Commander = function( group, u ,v  ) {
    /* gourp:
     * 0 : Player
     * 1 .. n : AI
     */
    this.group = group;
    this.type = "Commander";
    this.maxLen = 5;
    this.curLen = 0;
    this.units = new Array();

    /// Properties
    this.orientation = 0;

    
    this.init();
    this.tick = 0;
    this.u = 0;
    this.v = 1;
    
    this.setPos = function( u, v ) {
	if ( univMap.setMap( u, v, this ) ) {
	    this.requestUpdate();
	} else {
	    trace ( "[ERROR] setPos() of Commander." );
	}
    }
    this.addUnit = function( unit ) {
	this.units.push( unit );
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
    this.update = function() {
	return ;
    }


    /// Coordinates
    this.setPos( u, v );
}
Commander.prototype = new GameObject;

