var BattleHexagonView = function( m, height, width, margin ) {
    this.setModel( m );
    this.register( battlefield );

    this.left = margin;
    this.top = margin;
    
    
    var widthAvailable = width - 2.0 * margin;
    var radiusX = widthAvailable / (1.5 * this.model.cols - 1.5);
    var radiusY = heightAvailable / (Math.sqrt(3) * (this.model.rows + 0.5));
    if(radiusX < radiusY)
    {
	this.radius = radiusX;
    }
    else // radiusY < radiusX
    {
	this.radius = radiusY;
    }
    this.boundBox = { xmin: this.left - this.radius,
		      xmax: this.left + this.radius * ( 1.5 * this.model.cols - 0.5 ),
		      ymin: this.top - this.radius * Math.sqrt(3) * 0.5,
		      ymax: this.top + this.radius * Math.sqrt(3) * ( this.model.rows + 1 )
		    };
}

