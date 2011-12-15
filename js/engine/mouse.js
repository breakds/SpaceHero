var xOffset = document.getElementById("displays").offsetLeft;
var yOffset = document.getElementById("displays").offsetTop;

menu2d.onmousedown = function(e) {
    if(e.offsetX)
    {
	if ( 1 == e.which ) {
	    dispatcher.broadcast( { name: "LeftMouseDown", 
				    x: e.offsetX,
				    y: e.offsetY } );
	} else if ( 3 == e.which ) {
	    dispatcher.broadcast( { name: "RightMouseDown", 
				    x: e.offsetX,
				    y: e.offsetY } );
	}
    }
    else
    {
	if ( 1 == e.which ) {
	    dispatcher.broadcast( { name: "LeftMouseDown", 
				    x: e.clientX - xOffset,
				    y: e.clientY - yOffset } );
	} else if ( 3 == e.which ) {
	    dispatcher.broadcast( { name: "RightMouseDown", 
				    x: e.clientX - xOffset,
				    y: e.clientY - yOffset } );
	}
    }
}

menu2d.onmouseup = function(e) {
    if(e.offsetX)
    {
	if ( 1 == e.which ) {
	    dispatcher.broadcast( { name: "LeftMouseUp", 
				    x: e.offsetX,
				    y: e.offsetY } );
	} else if ( 3 == e.which ) {
	    dispatcher.broadcast( { name: "RightMouseUp", 
				    x: e.offsetX,
				    y: e.offsetY } );
	}
    }
    else
    {
	if ( 1 == e.which ) {
	    dispatcher.broadcast( { name: "LeftMouseUp", 
				    x: e.clientX - xOffset,
				    y: e.clientY - yOffset } );
	} else if ( 3 == e.which ) {
	    dispatcher.broadcast( { name: "RightMouseUp", 
				    x: e.clientX - xOffset,
				    y: e.clientY - yOffset } );
	}
	}
}

menu2d.onmousemove = function(e) {
	if(e.offsetX)
	{
    dispatcher.broadcast( { name: "MouseMove", 
			    x: e.offsetX,
			    y:e.offsetY } );
	}
	else
	{
    dispatcher.broadcast( { name: "MouseMove", 
			    x: e.clientX - xOffset,
			    y: e.clientY - yOffset} );
	}
}

/// Disable Right-Click Menu
menu2d.oncontextmenu = function() {
    return false;
}
/// Disable dbclick selection
menu2d.onselectstart = function() {
    return false;
}
