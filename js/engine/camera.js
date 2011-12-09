var Camera = function()
{
	this.viewMode = "galaxy"; // possible options are "galaxy", "star"
	this.viewObject; // if viewMode is "star", this is the star to look at
	this.viewDistance = 50; // if viewMode is "star", this is how far the camera is from the star
	this.interpolating = false; // set to "true" if camera is interpolating between viewModes
	
	// record last used orientations for the galaxy map and for star mode
	this.galaxyOrientation;
	this.starOrientation;
	
	// these quats are used to slerp the camera when it interpolates
	this.oldOrientation;
	this.newOrientation;
	
	// set up the projection matrices
	var aspectRatio = gl.viewportWidth / gl.viewportHeight;
	this.pMatrix = mat4.create();
	mat4.perspective(45, aspectRatio, 0.1, 100.0, this.pMatrix); // set up perspective matrix
	this.oMatrix = mat4.create();
	mat4.ortho(-100 * aspectRatio, 100 * aspectRatio, -100, 100, 0.1, 100.0);
	
	this.setProjectionMatrix = function(program)
	{
		gl.uniformMatrix4fv(program.pMatrixUniform, false, this.pMatrix);
	}
	
	this.position = vec3.create(); // position of camera
	this.position[0] = 0;
	this.position[1] = 0;
	this.position[2] = 0;
	
	this.orientation = quat4.create(); // orientation of camera
	this.orientation[0] = 0.5;
	this.orientation[1] = 0;
	this.orientation[2] = 0;
	quat4.calculateW(this.orientation);
	
	this.originalForward = vec3.create(); // forward vector when the camera's orientation is (0, 0, 0, 1)
	this.originalForward[0] = 0;
	this.originalForward[1] = 0;
	this.originalForward[2] = -1;
	
	var turnrate = -0.01; // how quickly the camera turns when using the rotateX and tiltX functions
	// dx, ndx, dy, ndy, dz, and ndz are used to increment the camera's orientation
	this.dx = quat4.create();
	this.dx[0] = turnrate;
	this.dx[1] = 0;
	this.dx[2] = 0;
	quat4.calculateW(this.dx, this.dx);
	this.ndx = quat4.create();
	this.ndx[0] = -turnrate;
	this.ndx[1] = 0;
	this.ndx[2] = 0;
	quat4.calculateW(this.ndx, this.ndx);
	this.dy = quat4.create();
	this.dy[0] = 0;
	this.dy[1] = turnrate;
	this.dy[2] = 0;
	quat4.calculateW(this.dy, this.dy);
	this.ndy = quat4.create();
	this.ndy[0] = 0;
	this.ndy[1] = -turnrate;
	this.ndy[2] = 0;
	quat4.calculateW(this.ndy, this.ndy);
	this.dz = quat4.create();
	this.dz[0] = 0;
	this.dz[1] = 0;
	this.dz[2] = turnrate;
	quat4.calculateW(this.dz, this.dz);
	this.ndz = quat4.create();
	this.ndz[0] = 0;
	this.ndz[1] = 0;
	this.ndz[2] = -turnrate;
	quat4.calculateW(this.ndz, this.ndz);
	
	// the following functions increment the camera's rotation using the quats given above.
	this.rotateUp = function()
	{
		quat4.multiply(this.dx, this.orientation, this.orientation);
	}
	this.rotateDown = function()
	{
		quat4.multiply(this.ndx, this.orientation, this.orientation);
	}
	this.rotateLeft = function()
	{
		quat4.multiply(this.dy, this.orientation, this.orientation);
	}
	this.rotateRight = function()
	{
		quat4.multiply(this.ndy, this.orientation, this.orientation);
	}
	this.tiltLeft = function()
	{
		quat4.multiply(this.dz, this.orientation, this.orientation);
	}
	this.tiltRight = function()
	{
		quat4.multiply(this.ndz, this.orientation, this.orientation);
	}
	this.circleX = function()
	{
		quat4.multiply(this.orientation, this.dx, this.orientation);
	}
	this.circleNX = function()
	{
		quat4.multiply(this.orientation, this.ndx, this.orientation);
	}
	this.circleY = function()
	{
		quat4.multiply(this.orientation, this.dy, this.orientation);
	}
	this.circleNY = function()
	{
		quat4.multiply(this.orientation, this.ndy, this.orientation);
	}
	this.circleZ = function()
	{
		quat4.multiply(this.orientation, this.dz, this.orientation);
	}
	this.circleNZ = function()
	{
		quat4.multiply(this.orientation, this.ndz, this.orientation);
	}
	
	this.rotateLocal = function(quat)
	{
		quat4.multiply(quat, this.orientation, this.orientation);
	}
	this.rotateGlobal = function(quat)
	{
		quat4.multiply(this.orientation, quat, this.orientation);
	}
	
	this.update = function()
	{
		if(this.viewMode == "star")
		{
			var forward = vec3.create();
			var transform = quat4.create();
			quat4.inverse(this.orientation, transform);
			quat4.multiplyVec3(transform, this.originalForward, forward);
			this.position[0] = this.viewObject.position[0] - this.viewDistance * forward[0];
			this.position[1] = this.viewObject.position[1] - this.viewDistance * forward[1];
			this.position[2] = this.viewObject.position[2] - this.viewDistance * forward[2];
		}
	}
}
