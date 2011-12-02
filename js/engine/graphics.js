var display3d = $( "display3d" );
var bg2d = $( "BackGround2d" );
var ani2d1 = $( "Animation2d1" );
var ani2d2 = $( "Animation2d2" );
var menu2d = $( "Menu" );
var GameScreen = { width: bg2d.width, height: bg2d.height };







/// 2d Context
/// if not enabled, this canvas will not be rendered
var ctxBg2d = bg2d.getContext( "2d" );
ctxBg2d.fillColor = "#000000";
var ctxMenu = menu2d.getContext( "2d" );
var ctx2d = new Array();
ctx2d.push( ani2d1.getContext( "2d" ) );
ctx2d.push( ani2d2.getContext( "2d" ) );





var lightShaderProgram;
var currentShader;

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();


var ambientLight = [0.0, 0.0, 0.0];
var lightPos = [0.0, 3.0, 0.0];
var lightDiffColor = [0.7, 0.7, 0.7];
var lightSpecColor = [0.4, 0.4, 0.4];

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
