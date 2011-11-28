var HexagonMap = function( cols, rows ) {
    /// The assignment of coordinates for the hexagon cells work this way:
    /// Note: Use integer (u,v) to represent coordinates 
    ///       And float   (x,y) to represent absolute positions
    /*                (1,0)
     *  (0,1)                       (2,1)    ....     (cols-1, 0/1)
     *                (1,2)
     *  (0,3)                       (2,3)
     *                (1,4)
     *  (0,5)
     *                  .
     *    .             .
     *    .             .
     *    .        (1, 2*rows)
     *  
     *  (0,2*rows+1)
     */
    this.rows = rows;
    this.cols = cols;


    /// The adjecent relative coordinates
    this.du = [ -1, 0, 1, 1, 0, -1 ];
    this.dv = [ -1, -2, -1, 1, 2, 1 ];


    /// Map
    /*
      0 - no objects on current cell
     */
    this.map = new Array();
    for ( var i=0; i<this.cols; i++ ) {
	this.map[i] = new Array();
	for ( var j=0; j<(this.rows<<1)+1; j++ ) {
	    this.map[i][j] = 0;
	}
    }

    /*
      lower bound and upper bound of v coordinates
      for ecah u.
    */
    this.lower = new Array();
    this.upper = new Array();
    
    var iTmp = 1;
    for ( var i=0; i<this.cols; i++ ) {
	this.lower[i] = iTmp;
	this.upper[i] = iTmp + ( this.rows << 1 );
	iTmp = 1 - iTmp;
    }
      
    
    this.init();
    this.update = function() {
	return ;
    }
    

    /// Check wether (u,v) is in the map
    this.inMap = function( u, v ) {
	if ( u < 0 || u >= this.cols ) {
	    return false;
	} else if ( v < this.lower[u] || v > this.upper[u] ) {
	    return false;
	} else if ( 0 == ( u + v ) & 1 ) {
	    return false;
	}
	return true;
    }
}
HexagonMap.prototype = new GameObject;
