function $() {
    return document.getElementById.apply( document, arguments );
}

function trace( msg ) {
    console.log( msg );
}