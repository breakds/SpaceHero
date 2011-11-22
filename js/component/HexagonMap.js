var HexagonMap = function( cols, rows, cellRadius ) {
    this.cols = cols;
    this.rows = rows;
    this.cellRadius = cellRadius;
    this.smallerRadius = cellRadius * Math.sqrt(3) * 0.5;

    this.drawHexagon = function( x, y ) {
	ctxBg2d.strokeStyle = "#000000";

	var ang = 0;
	ctxBg2d.beginPath();
	ctxBg2d.moveTo( x + this.cellRadius, y );
	for ( var i=0; i<6; i++ ) {
	    this.ang += Math.PI / 6;
	    ctxBg2d.lineTo( x + this.cellRadius * Math.cos( ang ), 
			    y + this.cellRadius * Math.sin( ang ) );
	}
	ctxBg2d.closePath();
	ctxBg2d.stroke();
    }

    this.drawGrid = function( x, y ) {
	var x0 = x;
	var y0 = y;
	for ( var col=0; col<this.cols; col++ ) {
	    if ( col & 1 ) {
		y0 = y - this.smallerRadius;
	    }
	    for ( var row=0; row<this.rows; row++ ) {
		this.drawHexagon( x0, y0 );
		y0 += this.smallerRadius * 2;
	    }
	    x0 += this.smallerRadius + this.cellRadius;
	}
    }
}

