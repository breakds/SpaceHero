var HexagonMap = function( rows, cols ) {
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


    // The following two arrays find adjacent board spaces
	// If you are at (u, v) then (u + du[i], v + dv[i]) is adjacent to you for 0 <= i < 6
    this.du = [ 0, 1, 1, 0, -1, -1 ];
    this.dv = [ -2, -1, 1, 2, 1, -1 ];


    /*
      lower bound and upper bound of v coordinates
      for ecah u.
    */
    this.lower = new Array();
    this.upper = new Array();
    
    var iTmp = 1;
    for ( var i=0; i<this.cols; i++ )
	{
		this.lower[i] = iTmp;
		this.upper[i] = iTmp + ( this.rows << 1 );
		iTmp = 1 - iTmp;
    }


    /// Unveil Animation
    this.unveilAnimations = new Array();


    /// Map
    /*
      0 - no objects on current cell
      otherwise - the object
     */
    this.map = new Array();
    for ( var i=0; i<this.cols; i++ )
	{
		this.map[i] = new Array();
		for ( var j=this.lower[i]; j<=this.upper[i]; j++ )
		{
			this.map[i][j] = 0;
		}
    }

    /// Terran
    /*
      0 - Ordinary Space
      1 - Solar System
      2 - Mine Nebula
     */
    this.terran = new Array();
    for ( var i=0; i<this.cols; i++ ) {
	this.terran[i] = new Array();
	for ( var j=this.lower[i]; j<=this.upper[i]; j++ ) {
	    this.terran[i][j] = 0;
	}
    }
    
    this.addSolarSystem = function( u, v ) {
	if ( this.inMap( u, v ) ) {
	    this.terran[u][v] = 1;
	}
    }

    this.addMineNebula = function( u, v ) {
	if ( this.inMap( u, v ) ) {
	    this.terran[u][v] = 2;
	}
    }


    /// Veil
    /*
     * veil[u][v] = true 
     * means that cell is not visible to the player
     */
    this.veil = new Array();
    for ( var i=0; i<this.cols; i++ ) {
	this.veil[i] = new Array();
	for ( var j=this.lower[i]; j<=this.upper[i]; j++ ) {
	    this.veil[i][j] = true;
	}
    }



    /// Auxilary Map
    this.auxMap = new Array();
    for ( var i=0; i<this.cols; i++ ) {
	this.auxMap[i] = new Array();
	for ( var j=this.lower[i]; j<=this.upper[i]; j++ ) {
	    this.auxMap[i][j] = 0;
	}
    }
    
    
    

   
      
    
    this.init();
    this.update = function()
	{
		return ;
    }
    

    // Check whether (u,v) is in the map
    this.inMap = function( u, v )
	{
		if ( u < 0 || u >= this.cols )
		{
			return false;
		}
		else if ( v < this.lower[u] || v > this.upper[u] )
		{
			return false;
		}
		else if ( 0 == ( u + v ) % 2 )
		{
			return false;
		}
		return true;
    }
    
    
    // check whether (u, v) is filled
    this.available = function( u, v )
	{
		if ( this.inMap( u, v ) && this.map[u][v] == 0 )
		{
			return true;
		}
		return false;
    }

    
    this.setMap = function( u, v, obj ) {
	if ( this.available( u, v ) ) {
	    this.map[u][v] = obj;
	    if ( this.inMap( obj.u, obj.v ) ) {
		this.map[obj.u][obj.v] = 0;
	    }
	    obj.u = u;
	    obj.v = v;
	    return true;
	}
	return false;
    }
	
	// returns the object in a map space
    this.getMap = function( u, v )
    {
	if ( this.inMap( u, v ) )
	{
	    return this.map[u][v];
	}
	return -1;
    }


    this.unveilArea = function( u, v, horizon ) {
	var q = new Array();
	this.unveil( u, v );
	q.push( { u:u, v:v, dist:0 } );
	var i = 0;
	var nu = 0;
	var nv = 0;
	do {
	    if ( q[i].dist < horizon ) {
		for ( var j=0; j<6; j++ ) {
		    nu = q[i].u + this.du[j];
		    nv = q[i].v + this.dv[j];
		    this.unveil( nu, nv );
		    if ( q[i].dist + 1 < horizon ) {
			q.push( {u:nu, v:nv, dist:q[i].dist+1} );
		    }
		}
	    }
	    i = i + 1;
	} while ( i < q.length );
    }

    this.unveil = function( u, v ) {
	if ( this.inMap( u, v ) && this.veil[u][v] ) {
	    this.veil[u][v] = false;
	    new HexCellUnveilAnimation( this, u, v );
	}
    }
    
    this.initAuxMap = function()
    {
	for ( var i=0; i<this.cols; i++ )
	{
	    for ( var j=this.lower[i]; j<=this.upper[i]; j++ )
	    {
		this.auxMap[i][j] = 0;
	    }
	}
    }
	
    this.floodFill = function( u0, v0, u1, v1 ) {
	if ( this.inMap( u0, v0 ) && this.available( u1, v1 ) ) {
	    this.initAuxMap();
	    var q = new Array();
	    q.push( { u: u0, v: v0, dir: -1, pre: -1 } );
	    this.auxMap[u0][v0] = 1;
	    var i = 0;
	    var nu = 0;
	    var nv = 0;
	    var j = 0;
	    var flag = false;
	    while ( i < q.length ) {
		for ( j=0; j<6; j++ ) {
		    nu = q[i].u + this.du[j];
		    nv = q[i].v + this.dv[j];
		    if ( this.available( nu, nv ) &&
			 0 == this.auxMap[nu][nv] && 
			 (!this.veil[nu][nv]) ) {
			this.auxMap[nu][nv] = 1;
			q.push( { u: nu, v: nv, dir: j, pre: i } );
			if ( nu == u1 && nv == v1 ) {
			    flag = true;
			    break;
			}
		    }
		}
		if ( flag ) {
		    break;
		}
		i++;
	    }
	    if ( flag ) {
		var path = new Array();
		i = q.length-1;
		do {
		    path.push( q[i].dir );
		    i = q[i].pre;
		} while ( 0 != i );
		path.reverse();
		return path;
	    }
	    return null;
	}
	return null;
    }

    this.getReachable = function( u0, v0, range ) {
	if ( this.inMap( u0, v0 ) ) {
	    this.initAuxMap();
	    var q = new Array();
	    q.push( { u: u0, v: v0, pre: -1, step: 0 } );
	    this.auxMap[u0][v0] = 1;
	    var i = 0;
	    var nu = 0;
	    var nv = 0;
	    var j = 0;
	    while ( i < q.length ) {
		if ( q[i].step < range ) {
		    for ( j=0; j<6; j++ ) {
			nu = q[i].u + this.du[j];
			nv = q[i].v + this.dv[j];
			if ( this.available( nu, nv ) &&
			     0 == this.auxMap[nu][nv] ) {
			    this.auxMap[nu][nv] = 1;
			    q.push( { u: nu, v: nv, step: q[i].step+1, pre: i } );
			}
		    }
		}
		i++;
	    }
	    return q;
	}
	return null;
    }
}

HexagonMap.prototype = new GameObject;





var HexCellUnveilAnimation = function( hexmap, u, v ) {
    this.objs = new Array();
    this.objs.push( hexmap );
    this.lifetime = 20;
    this.objs[0].unveilAnimations.push( this );
    this.angle = 0.0;
    this.u = u;
    this.v = v;
    
    this.onTerminate = function() {
	this.objs[0].unveilAnimations.splice(
	    this.objs[0].unveilAnimations.indexOf( this ), 1
	);
	this.objs[0].requestUpdate();
    }
    
    this.next = function() {
	this.angle += Math.PI / 40.0;
	this.objs[0].requestUpdate();
    }
    this.init();
}
HexCellUnveilAnimation.prototype = new Tween;
