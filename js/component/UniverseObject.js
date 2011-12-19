var MineStar = function( u, v ) {
    this.type = "Mine";
    this.landlord = null;
    this.u = u;
    this.v = v;
    univMap.addMineStar( u, v, this );
    this.income = 1000;
    this.onOccupy = function( cmder ) {
	if ( (!this.landlord ) ||
	     ( this.landlord != forces[cmder.group] ) ) {
		 this.landlord = forces[cmder.group];
	}
    }
    dispatcher.addListener( "NewTurn", this );
    this.onNewTurn = function( e ) {
	if ( this.landlord ) {
	    this.landlord.gold += this.income;
	}
    }
}