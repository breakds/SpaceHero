var StarField = function()
{
	var stars = 1000;
	
	var vertices = new Array();
	var colors = new Array();
	
	for(var i = 0.0; i < stars; i++)
	{
		var theta = Math.random() * 2.0 * Math.PI;
		var phi = Math.random() * Math.PI;
		vertices.push(Math.sin(phi) * Math.sin(theta));
		vertices.push(Math.sin(phi) * Math.cos(theta));
		vertices.push(Math.cos(phi));
		colors.push(1.0);
		colors.push(1.0);
		colors.push(1.0);
		colors.push(1.0);
	}
	
	this.starVertexBuffer = gl.createBuffer();
	this.starColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.starVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.starColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	this.starVertexBuffer.itemSize = 3;
	this.starVertexBuffer.numItems = stars;
	this.starColorBuffer.itemSize = 4;
	this.starColorBuffer.numItems = stars;
    
    this.draw = function()
	{
		var oldMVMatrix = mat4.create();
		mat4.set(mvMatrix, oldMVMatrix);
		setShader(notShaderProgram);
		mat4.translate(mvMatrix, cam.position);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.starVertexBuffer);
		gl.vertexAttribPointer(notShaderProgram.vertexPositionAttribute, this.starVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.starColorBuffer);
		gl.vertexAttribPointer(notShaderProgram.vertexColorAttribute, this.starColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
		setMatrixUniforms(notShaderProgram);
		gl.drawArrays(gl.POINTS, 0, this.starVertexBuffer.numItems);
		setShader(lightShaderProgram);
		mat4.set(oldMVMatrix, mvMatrix);
    }
}