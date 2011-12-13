var CommanderMenu = function( commander, right, top ) {
    this.setModel( commander );
    this.register( universe );
    this.top = top;
    this.right = right;
    this.width = 240;
    this.height = 400;
    this.maxAP = 10.0;
    this.APBarLen = 150.0;
    this.draw = function( ctx ) {
	if ( ctx == ctxMenu ) {
	    /// Draw Frame
	    ctxMenu.strokeStyle = "#FFFFFF";
	    ctxMenu.lineWidth = 2;
	    ctxMenu.strokeRect( this.right - this.width - 2, 
				this.top, this.width, this.height );
	    
	    /// Draw Icon
	    ctxMenu.lineWidth = 1;
	    ctxMenu.strokeStyle = "#FFFFFF";
	    ctxMenu.strokeRect( this.right - this.width - 2 + 15, this.top+15, 120, 120 );
	    ctxMenu.fillStyle = "#FF0000";
	    ctxMenu.fillRect( this.right - this.width - 2 + 15, this.top+15, 120, 120 );
	    
	    /// Draw Title and name
	    ctxMenu.fillStyle = "#FFFF00";
	    ctxMenu.font = "18px Arial";
	    ctxMenu.textAlign = "left";
	    ctxMenu.textBaseline = "alphabetic";
	    ctxMenu.fillText( this.model.title, 
			      this.right - this.width - 2 + 145,
			      this.top + 45 );
	    
	    ctxMenu.strokeStyle = "#00AABB";
	    ctxMenu.font = "20px Arial";
	    ctxMenu.textBaseline = "alphabetic";
	    ctxMenu.strokeText( this.model.name,
				this.right - this.width - 2 + 145,
				this.top + 75 );
	    /// Draw Level
	    ctxMenu.fillStyle = "#FFFFFF";
	    ctxMenu.font = "22px Arial";
	    ctxMenu.textBaseline = "top";
	    ctxMenu.fillText( "Lv. " + this.model.level, this.right - this.width - 2 + 145,
			      this.top + 105 );

	    /// Draw AP
	    ctxMenu.lineWidth = 1;
	    ctxMenu.strokeStyle = "#FFFFFF";
	    ctxMenu.strokeRect( this.right - this.width - 2 + 15, this.top+160, 
				this.APBarLen, 20 );

	    ctxMenu.fillStyle = "#00FF00";
	    ctxMenu.fillRect( this.right - this.width - 2 + 15, 
			      this.top+160,
			      this.APBarLen * this.model.AP / this.maxAP, 20 );

	    ctxMenu.fillStyle = "#00BB00";
	    ctxMenu.font = "19px Arial";
	    ctxMenu.textBaseline = "top";
	    ctxMenu.fillText( "AP " + this.model.AP, this.right - 60,
			      this.top + 160 );

	    /// Draw Attack and Defence
	    ctxMenu.drawImage( resources.getResource("swordIcon"),
			       this.right - this.width - 2 + 20,
			       this.top + 200,
			       40, 40 );
	    ctxMenu.fillStyle = "#FF4444";
	    ctxMenu.font = "25px Arial";
	    ctxMenu.textBaseline = "top";
	    ctxMenu.fillText( this.model.att,
			      this.right - this.width - 2 + 80,
			      this.top + 205 );

	    ctxMenu.drawImage( resources.getResource("shieldIcon"),
			       this.right - 120,
			       this.top + 200,
			       40, 40 );
	    ctxMenu.fillStyle = "#4444FF";
	    ctxMenu.font = "25px Arial";
	    ctxMenu.textBaseline = "top";
	    ctxMenu.fillText( this.model.def,
			      this.right - 60,
			      this.top + 205 );


	    /// Draw Units
	    ctxMenu.lineWidth = 1;
	    ctxMenu.strokeStyle = "#FFFFFF";
	    ctxMenu.strokeRect( this.right - this.width + 12 + 15, this.top+250, 60, 60  );
	    ctxMenu.strokeRect( this.right - this.width + 12 + 75, this.top+250, 60, 60  );
	    ctxMenu.strokeRect( this.right - this.width + 12 + 135, this.top+250, 60, 60  );
	    ctxMenu.strokeRect( this.right - this.width + 12 + 15, this.top+310, 60, 60  );
	    ctxMenu.strokeRect( this.right - this.width + 12 + 75, this.top+310, 60, 60  );
	    ctxMenu.strokeRect( this.right - this.width + 12 + 135, this.top+310, 60, 60  );
	    var x = this.right - this.width + 12 + 15;
	    var y = this.top + 250;
	    var k = 0;
	    for ( var i=0; i<2; i++ ) {
		var x = this.right - this.width + 12 + 15;
		for ( var j=0; j<3; j++ ) {
		    if ( k < this.model.units.length ) {
			drawRotatedImage( ctxMenu,
					  this.model.units[k].template.image,
					  0,
					  x,
					  y,
					  50,
					  50,
					  false );
			ctxMenu.fillStyle = "#00AAFF";
			ctxMenu.font = "15px Arial";
			ctxMenu.textBaseline = "top";
			ctxMenu.textAlign = "center";
			ctxMenu.fillText( this.model.units[k].quantity, 
					  x + 40,
					  y + 40 );
			k++;
		    } else {
			break;
		    }
		    x += 60;
		}
		y+=60;
	    }
	    
	    

	}
    }


    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
    }
    this.requestUpdate();
}
CommanderMenu.prototype = new View;
