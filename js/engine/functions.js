function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }

    function setMatrixUniforms(program) {
		cam.setProjectionMatrix(program);
		gl.uniformMatrix4fv(program.mvMatrixUniform, false, mvMatrix);
		if(program == lightShaderProgram)
		{
			var normalMatrix = mat3.create();
			mat4.toInverseMat3(mvMatrix, normalMatrix);
			mat3.transpose(normalMatrix);
			gl.uniformMatrix3fv(program.nMatrixUniform, false, normalMatrix);
		}
    }

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }
	
	function loadModels() {
		
	}
	
	function getDistance(pos1, pos2) {
      return Math.sqrt(((pos1[0]-pos2[0])*(pos1[0]-pos2[0]))+((pos1[1]-pos2[1])*(pos1[1]-pos2[1]))+((pos1[2]-pos2[2])*(pos1[2]-pos2[2])));
    }
    
    function random(min, max) {
	return min + Math.floor(Math.random() * (max - min));
    }