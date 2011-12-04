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
	    ctxMenu.textBaseline = "left";
	    ctxMenu.fillText( this.model.title, 
			      this.right - this.width - 2 + 145,
			      this.top + 45 );
	    
	    ctxMenu.strokeStyle = "#00AABB";
	    ctxMenu.font = "22px Arial";
	    ctxMenu.textBaseline = "left";
	    ctxMenu.strokeText( this.model.name,
				this.right - this.width - 2 + 145,
				this.top + 75 );
	    /// Draw Level
	    ctxMenu.fillStyle = "#FFFFFF";
	    ctxMenu.font = "22px Arial";
	    ctxMenu.textBaseline = "left";
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

	}
    }


    this.requestUpdate = function() {
	dispatcher.broadcast( { name: "UpdateContext",
				ctx: ctxMenu } );
    }
    this.requestUpdate();
}
CommanderMenu.prototype = new View;
