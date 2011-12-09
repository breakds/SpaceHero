window.onkeydown = function(e) {
    dispatcher.broadcast( { name:"KeyDown",
			    key: e.keyCode } );
}

window.onkeyup = function(e) {
    dispatcher.broadcast( { name:"KeyUp",
			    key: e.keyCode } );
}
