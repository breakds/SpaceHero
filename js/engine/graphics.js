var display2d = $( "display2d" );
var display3d = $( "display3d" );
var c2d = display2d.getContext( "2d" );


var lightShaderProgram;
var currentShader;
    
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

	
var ambientLight = [0.2, 0.2, 0.2];
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