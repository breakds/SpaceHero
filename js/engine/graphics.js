/*
 * Code from 
 * http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html
 */
CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined" ) {
	stroke = true;
    }
    if (typeof radius === "undefined") {
	radius = 5;
    }
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
    if (stroke) {
	this.stroke();
    }
    if (fill) {
	this.fill();
    }        
}
 

var display3d = $( "display3d" );
var bg2d = $( "BackGround2d" );
var ani2d1 = $( "Animation2d1" );
var ani2d2 = $( "Animation2d2" );
var ani2d3 = $( "Animation2d3" );
var menu2d = $( "Menu" );
var GameScreen = { width: bg2d.width, height: bg2d.height };




/// 2d Context
/// if not enabled, this canvas will not be rendered

var ctxBg2d = bg2d.getContext( "2d" );
ctxBg2d.fillColor = "#000000";
ctxBg2d.updated = false;
var ctxMenu = menu2d.getContext( "2d" );
ctxMenu.updated = false;
var ctx2d = new Array();
ctx2d.push( ani2d1.getContext( "2d" ) );
ctx2d[0].updated = false;
ctx2d.push( ani2d2.getContext( "2d" ) );
ctx2d[1].updated = false;
ctx2d.push( ani2d3.getContext( "2d" ) );
ctx2d[2].updated = false;

var allContexts = new Array();
allContexts.push( ctxBg2d );
allContexts.push( ctxMenu );
allContexts.push( ctx2d[0] );
allContexts.push( ctx2d[1]);
allContexts.push( ctx2d[2]);

function clearContext(ctx) {
    if ( ctx.fillColor ) {
	ctx.fillStyle = ctx.fillColor;
	ctx.fillRect( 0, 0, GameScreen.width, GameScreen.height );
    } else {
	ctx.clearRect( 0, 0, GameScreen.width, GameScreen.height );
    }
}






var lightShaderProgram;
var currentShader;

var mvMatrix = mat4.create();
var mvCamera = mat4.create();
var mvMatrixStack = [];


var ambientLight = [0.15, 0.15, 0.15];
var lightPos = [0.0, 0.0, 0.0];
var lightDiffColor = [0.7, 0.7, 0.7];
var lightSpecColor = [0.2, 0.2, 0.2];

var gl;
try {
    gl = display3d.getContext("experimental-webgl");
    gl.viewportWidth = display3d.width;
    gl.viewportHeight = display3d.height;

} catch (e) {
    alert("Could not initialise WebGL");
}
if (!gl) {
    alert("Could not initialise WebGL");
}
initShaders();
loadModels();


gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.BLEND);
//gl.enable(gl.TEXTURE_2D);

//// Disable CullFace for now so that cube renders on both sides
gl.disable(gl.CULL_FACE);
////

gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

//set up viewport
gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	    setShader(lightShaderProgram);
	    gl.useProgram(currentShader);
