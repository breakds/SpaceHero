function $() {
    return document.getElementById.apply( document, arguments );
}

function trace( msg ) {
    console.log( msg );
}

function drawRotatedImage( ctx, img, ang, x, y, width, height, centered ) {
    ctx.save();
    ctx.translate( x, y );
    ctx.rotate( ang );
    if ( centered ) {
	ctx.drawImage( img, -0.5 * width, -0.5 * height,
		       width, height );
    } else {
	ctx.drawImage( img, 0, 0,
		       width, height );
    }
    ctx.restore();
}
function drawRotatedImage2( ctx, img, ang, x, y, width, height, centerX, centerY ) {
    ctx.save();
    ctx.translate( x, y );
    ctx.rotate( ang );
    ctx.drawImage( img, -centerX, -centerY,
		   width, height );
    ctx.restore();
}