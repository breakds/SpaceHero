var forces = new Array();
var Force = function( name, type, color ) {
    this.groupID = forces.length;
    forces.push( this );
    /*
     * type can be "AI" or "Player"
     */
    this.type = type;
    this.name = name;
    this.gold = 5000;
    this.colorFlag = resources.getResource( color + "Flag" );


    /// Commanders that belongs to this force
    this.commanders = new Array();

    this.mines = new Array();
    this.declareMine = function( mine ) {
	var idx = this.mines.indexOf( mine );
	if ( -1 == idx ) {
	    this.mines.push( mine );
	    mine.landlord = this;
	    this.updateIncome();
	}
    }

    this.removeMine = function( mine ) {
	var idx = this.mines.indexOf( mine );
	if ( -1 != idx ) {
	    this.mines.splice( idx, 1 );
	    mine.landlord = null;
	    this.updateIncome();
	}
    }

    this.solars = new Array();
    this.declareSolar = function( solar ) {
	var idx = this.solars.indexOf( solar );
	if ( -1 == idx ) {
	    this.solars.push( solar );
	    this.updateIncome();
	}
    }

    this.removeSolar = function( solar ) {
	var idx = this.solars.indexOf( solar );
	if ( -1 != idx ) {
	    this.solars.splice( idx, 1 );
	    this.updateIncome();
	}
    }
    
    this.income = 0;
    this.updateIncome = function() {
	this.income = 0;
	for ( var i=0; i<this.mines.length; i++ ) {
	    this.income += this.mines[i].income;
	}
	for ( var i=0; i<this.solars.length; i++ ) {
	    this.income += this.solars[i].miners * this.solars[i].incomeRate;
	}
	this.requestUpdate();
    }




    this.setID = function( id ) {
	this.groupID = id;
    }
    
    this.createCommander = function( title, name, u, v ) {
	this.commanders.push( new Commander( title, name, this.groupID, u, v ) );
	new CommanderUniverseView( this.commanders[this.commanders.length-1] );
    }
    


    this.createRandomCommander = function( u, v ) {
	if ( this.gold >= 2500 ) {
	    this.gold -= 2500;
	    var title = commanderTitlePool[ 
		Math.floor( Math.random() * commanderTitlePool.length ) 
	    ];
	    var name = commanderNamePool[ 
		Math.floor( Math.random() * commanderNamePool.length ) 
	    ];
	    this.commanders.push( new Commander( title, name, this.groupID, u, v ) );
	    var cmder = this.commanders[this.commanders.length-1];
	    new CommanderUniverseView( cmder );
	    /// Randomly Number Of Fighter
	    cmder.addUnit( Fighter );
	    cmder.units[0].setQuantity( 5 + Math.floor( Math.random() * 5 )  );
	    this.requestUpdate();
	}
    }
    
    
    this.removeCommander = function( cmder ) {
	this.commanders.splice( this.commanders.indexOf( cmder ), 1 );
    }
    if ( "AI" == this.type ) {
	this.thinking = false;
	this.attackOrEscape = function( cmder ) {
	    var pathes = new Array();
	    for ( var i=0; i<forces[0].commanders.length; i++ ) {
		pathes.push( 
		    univMap.floodFillnoVeil2( 
			cmder.u,
			cmder.v,
			forces[0].commanders[i].u,
			forces[0].commanders[i].v 
		    ) 
		);
	    } 
	    
	    /// Escape
	    var power = cmder.getPower();
	    for ( var i=0; i<forces[0].commanders.length; i++ ) {
		if ( pathes[i] ) {
		    var power1 = forces[0].commanders[i].getPower();
		    if ( power1 < 1.1 * power ) {
			continue;
		    }
		    if ( pathes[i].length <= forces[0].commanders[i].maxAP ) {
			for ( var j=0; j<6; j++ ) {
			    var u = cmder.u + univMap.du[j];
			    var v = cmder.v + univMap.dv[j];
			    if ( univMap.available( u, v ) ) {
				var tmpPath = univMap.floodFill3( 
				    u, 
				    v,
				    forces[0].commanders[i].u,
				    forces[0].commanders[i].v 
				);
				if ( tmpPath ) {
				    if ( tmpPath.length > pathes[i].length ) {
					cmder.setOrientation( j );
					if ( cmder.stepForward() ) {
					    return true;
					}
				    }
				}
			    }
			}
		    }
		}
	    }


	    /// Go Attack
	    for ( var i=0; i<forces[0].commanders.length; i++ ) {
		if ( pathes[i] ) {
		    var power1 = forces[0].commanders[i].getPower();
		    if ( power1 > 0.8 * power ) {
			continue;
		    }
		    if ( pathes[i].length <= cmder.AP + 2 ) {
			cmder.setOrientation( pathes[i][0] );
			if ( cmder.stepForward() ) {
			    return true;
			} else {
			    var enemy = univMap.getMap( 
				cmder.u + univMap.du[pathes[i][0]],
				cmder.v + univMap.dv[pathes[i][0]] );
			    if ( enemy.group != cmder.group ) {
				forces[cmder.group].thinking = false;
				dispatcher.broadcast( 
				    { name: "StartBattle",
				      commander0: cmder,
				      commander1: enemy,
				      returnThinking: forces[cmder.group] } );
			    }
			    return true;
			}
		    }
		}
	    }
	    return false;
	}


	this.tryStar = function( cmder ) {
	    var pathes = new Array();
	    for ( var i=0; i<stars.length; i++ ) {
		pathes.push( 
		    univMap.floodFillnoVeil( 
			cmder.u,
			cmder.v,
			stars[i].u,
			stars[i].v
		    ) 
		);
	    } 
	    
	    /// Sort
	    var ind = new Array();
	    for ( var i=0; i<stars.length; i++ ) {
		ind.push( i );
	    }
	    for ( var i=0; i<stars.length-1; i++ ) {
		for ( var j=1; j<stars.length; j++ ) {
		    if ( ( pathes[ind[j]] && (!pathes[ind[i]] ) ) ||
			 ( pathes[ind[j]] && pathes[ind[i]] && 
			   pathes[ind[j]].length < pathes[ind[i]].length ) ) {
			var tmp = ind[i];
			ind[i] = ind[j];
			ind[j] = tmp;
		    }
		}
	    }


	    /// Empty Star
	    for ( var i=0; i<stars.length; i++ ) {
		if ( pathes[ind[i]] ) {
		    if ( !stars[ind[i]].owner ) {
			cmder.setOrientation( pathes[ind[i]][0] );
			if ( cmder.stepForward() ) {
			    if ( cmder.u == stars[ind[i]].u &&
				 cmder.v == stars[ind[i]].v ) {
				stars[ind[i]].setOwner( 
				    forces[cmder.group]
				);
			    }
			    return true;
			}
		    }
		}
	    }
	    
	    
	    /// Enemy Star
	    if ( cmder.getPower() < 18000 ) {
		return false;
	    }
	    
	    for ( var i=0; i<stars.length; i++ ) {
		if ( pathes[ind[i]] ) {
		    if ( stars[ind[i]].owner ) {
			if ( stars[ind[i]].owner.groupID 
			     == cmder.group ) {
			    continue;
			}
			cmder.setOrientation( pathes[ind[i]][0] );
			if ( cmder.stepForward() ) {
			    if ( cmder.u == stars[ind[i]].u &&
				 cmder.v == stars[ind[i]].v ) {
				forces[cmder.group].thinking = false;
				stars[ind[i]].owner.createCommander( "Defender", "Cannons", -1, -1 );
				var defender = stars[ind[i]].owner.commanders[stars[ind[i]].owner.commanders.length -1 ];
				defender.type = "defender";
				defender.star = stars[ind[i]];
				for ( var l=0; l<stars[ind[i]].defenseSystem; l++ ) {
				    defender.addUnit( Cannon );
				}
				dispatcher.broadcast( {name: "StartBattle",
						       commander0: cmder,
						       commander1: defender,
						       returnThinking: forces[cmder.group]
						      } );
			    }
			    return true;
			}
		    }
		}
	    }
	    
	    
	    
	    return false;
	}



	this.tryPurchase = function( cmder ) {
	    var pathes = new Array();
	    for ( var i=0; i<stars.length; i++ ) {
		pathes.push( 
		    univMap.floodFillnoVeil( 
			cmder.u,
			cmder.v,
			stars[i].u,
			stars[i].v
		    ) 
		);
	    } 
	    
	    /// Sort
	    var ind = new Array();
	    for ( var i=0; i<stars.length; i++ ) {
		ind.push( i );
	    }
	    for ( var i=0; i<stars.length-1; i++ ) {
		for ( var j=1; j<stars.length; j++ ) {
		    if ( ( pathes[ind[j]] && (!pathes[ind[i]] ) ) ||
			 ( pathes[ind[j]] && pathes[ind[i]] && 
			   pathes[ind[j]].length < pathes[ind[i]].length ) ) {
			var tmp = ind[i];
			ind[i] = ind[j];
			ind[j] = tmp;
		    }
		}
	    }

	    for ( var i=0; i<stars.length; i++ ) {
		if ( pathes[ind[i]] ) {
		    if ( stars[ind[i]].owner ) {
			if ( stars[ind[i]].owner.groupID
			     == cmder.group ) {
			    cmder.setOrientation( pathes[ind[i]][0] );
			    if ( cmder.stepForward() ) {
				if ( cmder.u == stars[ind[i]].u &&
				     cmder.v == stars[ind[i]].v ) {
				    /// Purchase
				    var force = forces[cmder.group];
				    for ( var j=0; j<6; j++ ) {
					while ( force.gold >= UnitTypes[j].price && stars[ind[i]].quantities[j] > 0 ) {
					    force.gold -= UnitTypes[j].price;
					    stars[ind[i]].quantities[j]--;
					    cmder.addUnit( UnitTypes[j] );
					}
				    }
				}
			    }
			    return true;
			}
		    }
		}
	    }
	    
	    return false;
	}

	this.update = function() {
	    if ( this.thinking ) {
		this.tick++;
		if ( 0 != this.tick % 5 ) return;

		/// Try build Miner
		for ( var i=0; i<stars.length; i++ ) {
		    if ( stars[i].owner == this ) {
			if ( this.gold > stars[i].getMinerPrice() ) {
			    stars[i].addMiner();
			}
		    }
		}
		
		
		for ( var i=0; i<this.commanders.length; i++ ) {
		    if ( this.commanders[i].AP > 0 ) {
			var cmder = this.commanders[i];


			/// Try Stars
			if ( this.tryStar( cmder ) ) {
			    return ;
			}


			/// Try Escape or Attack
			if ( this.attackOrEscape( cmder ) ) {
			    return;
			}





			/// Easy Reachable Mines
			for ( var j=0; j<mines.length; j++ ) {
			    if ( (!mines[j].landlord) ||
				 mines[j].landlord.groupID != cmder.group ) {
				var path = univMap.floodFillnoVeil( 
				    cmder.u,
				    cmder.v,
				    mines[j].u,
				    mines[j].v
				);
				
				if ( !path ) {
				    continue;
				}
				cmder.setOrientation( path[0] );
				if ( cmder.stepForward() ) {
				    terran = univMap.terran[cmder.u][cmder.v];
				    if ( 0 != terran && "Mine" == terran.type ) {
					terran.onOccupy( cmder );
				    }
				    return;
					
				}
			    }
			}
			
			if ( this.tryPurchase( cmder ) ) {
			    return;
			}
			
			do { 
			    this.commanders[i].setOrientation( Math.floor( Math.random() * 6 ) );
			} while ( ! this.commanders[i].stepForward() );
			return;
		    }
		}



		/// Create Commander ?
		if ( this.gold > 12000 && this.commanders.length < 5) {
		    if ( this.solars.length > 0 ) {
			var r = Math.floor( Math.random() * this.solars.length );

			var flag = true;
			var solar = this.solars[r];
			for ( var j=0; j<6; j++ ) {
			    var u = solar.u + univMap.du[j];
			    var v = solar.v + univMap.dv[j];
			    if ( univMap.available( u, v) ) {
				solar.owner.createRandomCommander( u, v );
				flag = true;
				break;
			    }
			}

		    }
		}



		/// Try build Defence System
		for ( var i=0; i<stars.length; i++ ) {
		    if ( stars[i].owner == this ) {
			if ( this.gold > stars[i].getDefenseSystemPrice() * 3 ) {
			    stars[i].addDefenseSystem();
			}
		    }
		}

		/// Try build Refinery
		for ( var i=0; i<stars.length; i++ ) {
		    if ( stars[i].owner == this ) {
			if ( this.gold > stars[i].getRefineryPrice() * 4 ) {
			    stars[i].addRefinery();
			}
		    }
		}




		
		this.thinking = false;
		dispatcher.broadcast( { name: "EndTurn", 
					groupID: this.groupID } );
	    }
	}
	this.go = function() {
	    this.tick = 0;
	    this.thinking = true;
	}
	this.init();
    }
    
    dispatcher.addListener( "EndTurn", this );
    this.onEndTurn = function( e ) {
	if ( e.groupID == this.groupID ) {
	    for ( var i=0; i<this.commanders.length; i++ ) {
		this.commanders[i].AP = 0;
	    }
	}
    }

    dispatcher.addListener( "NewTurn", this );
    this.onNewTurn = function( e ) {
	for ( var i=0; i<this.commanders.length; i++ ) {
	    this.commanders[i].restoreAP();
	}
    }
}
Force.prototype = new GameObject;


