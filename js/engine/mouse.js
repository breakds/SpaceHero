menu2d.onmousedown = function(e) {
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

menu2d.onmousemove = function(e) {
    dispatcher.broadcast( { name: "MouseMove", 
			    x: e.offsetX,
			    y:e.offsetY } );
}


/// Disable Right-Click Menu
menu2d.oncontextmenu = function() {
    return false;
}
/// Disable dbclick selection
menu2d.onselectstart = function() {
    return false;
}
