function Model(modelPath, texturePath) {
    var that = this;
    
	modelPath = "models/" + modelPath;
	if (texturePath == null) {
		texturePath = "default.png";
	}
	texturePath = "textures/" + texturePath;
	
    this.shininess = 2;
	this.ul = true; // use lighting

    this.pos = [0.0,0.0,0.0];
    this.rot = [0.0,0.0,0.0];
    this.size = [1.0, 1.0, 1.0];
    this.texture;
    this.textureImg = texturePath;

    this.vertexBuffer;
    this.vertices = [];

    this.colorsBuffer;
    this.colors = [];

    this.textCoordsBuffer;
    this.textCoords = []; // Texture coordinates

    this.normBuffer;
    this.normals = [];

    this.indicesBuffer;
    this.indices = [];

    this.translating = false;
    this.rotating = false;
    this.conRot = false;
    this.scaling = false;
    this.newPos = [0.0,0.0,0.0];
    this.newRot = [0.0,0.0,0.0];
    this.newScale = [0.0,0.0,0.0];
    this.moveSpeed = 0;
    this.velVector = [0.0,0.0,0.0];
    //this.rotSpeed = 0;
    this.rotSpeedVector = [0.0,0.0,0.0];
    this.scaleSpeed = 0;
    this.scaleSpeedVector = [0.0,0.0,0.0];

    this.loadModel = function(path) {
		var result = jQuery.ajax({ url: path, async: false }).responseText;
		var lines = result.split('\n');
		var v = [];
		var n = [];
		var t = [];
		for (var i = 0; i < lines.length; i++) {
			if (lines[i][0] == 'v') {
				if (lines[i][1] == ' ') {
					var array = lines[i].split(" ");
					for (var j = 1; j <= 3; j++) {
						v[v.length] = parseFloat(array[j]);
						//console.log(array[j]);
					}
				}
				else if (lines[i][1] == 't') {
                    var array = lines[i].split(" ");
                    for (var j = 1; j <= 2; j++) {
                        t[t.length] = parseFloat(array[j]);
                    }
				}
				else if (lines[i][1] == 'n') {
					var array = lines[i].split(" ");
					for (var j = 1; j <= 3; j++) {
						n[n.length] = parseFloat(array[j]);
					}
				}
				else {
					console.log("Unknown line in model: " + name + " Line: " + i );
				}
			}
			else if (lines[i][0] == 'f') {
				var array = lines[i].split(" ");
				for (var j = 1; j <= 3; j++) {
					var values = array[j].split("/");
					that.vertices[that.vertices.length] = v[3 * (parseFloat(values[0]) - 1)];	
					that.vertices[that.vertices.length] = v[(3 * (parseFloat(values[0]) - 1)) + 1];			
					that.vertices[that.vertices.length] = v[(3 * (parseFloat(values[0]) - 1)) + 2];				
					that.textCoords[that.textCoords.length] = t[2 * (parseFloat(values[1]) - 1)];
					that.textCoords[that.textCoords.length] = t[2 * (parseFloat(values[1]) - 1) + 1];
					that.normals[that.normals.length] = n[3* (parseFloat(values[2]) - 1)];
					that.normals[that.normals.length] = n[3* (parseFloat(values[2]) - 1) + 1];
					that.normals[that.normals.length] = n[3* (parseFloat(values[2]) - 1) + 2];
					that.indices[that.indices.length] = parseFloat(parseFloat(values[0] - 1));
                }
			}
		}
	}
    
    this.initObject = function() {
        that.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, that.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.vertices), gl.STATIC_DRAW);
        that.vertexBuffer.itemSize = 3;
        that.vertexBuffer.numItems = that.vertices.length / 3;
		
		that.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, that.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.normals), gl.STATIC_DRAW);
		that.normalBuffer.itemSize = 3;
        that.normalBuffer.numItems = that.normals.length / 3;
		
	that.textCoordsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, that.textCoordsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(that.textCoords), gl.STATIC_DRAW);
	that.textCoordsBuffer.itemSize = 2;
	that.textCoordsBuffer.numItems = that.textCoords.length / 2;
	
	that.texture = gl.createTexture();
	that.texture.image = new Image();
	that.texture.image.onload = function() {
	    gl.bindTexture(gl.TEXTURE_2D, that.texture);
	    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, that.texture.image);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	    gl.bindTexture(gl.TEXTURE_2D, null);
	}
	that.texture.image.src = that.textureImg;
            
        that.indicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, that.indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(that.indices), gl.STATIC_DRAW);
        that.indicesBuffer.itemSize = 1;
        that.indicesBuffer.numItems = that.indices.length;
    }
    
    this.loadModel(modelPath);
    this.initObject();
	
	this.useLighting = function(ul) {
		that.ul = ul;
	}
	
    this.setPosition = function(x, y, z) {
	    that.pos[0] = x;
	    that.pos[1] = y;
	    that.pos[2] = z;
    }
    
    this.setScale = function(x, y, z) {
	    that.size[0] = x;
	    that.size[1] = y;
	    that.size[2] = z;
    }
    
    this.setRotation = function(x, y, z) {
	    that.rot[0] = degToRad(x);
	    that.rot[1] = degToRad(y);
	    that.rot[2] = degToRad(z);
    }
    
    this.translate = function(x, y, z, speed) {
	var fps = 60;
	speed /= fps;
	that.newPos[0] = x;
	that.newPos[1] = y;
	that.newPos[2] = z;
	that.translating = true;
	this.moveSpeed = speed;
	that.velVector = [(that.newPos[0] - that.pos[0]) * speed, (that.newPos[1] - that.pos[1]) * speed, (that.newPos[2] - that.pos[2]) * speed];
	//console.log("velocity: " + that.velVector);
    }
    
    this.rotate = function(x, y, z, speed) {
	var fps = 60;
	speed /= fps;
	that.newRot[0] = degToRad(x);
	that.newRot[1] = degToRad(y);
	that.newRot[2] = degToRad(z);
	that.rotating = true;
	that.rotSpeedVector = [(that.newRot[0] - that.rot[0]) * speed, (that.newRot[1] - that.rot[1]) * speed, (that.newRot[2] - that.rot[2]) * speed];
	console.log("rotation vector " + that.newRot);
    }
    
    this.constantRotation = function(xSpeed, ySpeed, zSpeed) {
		that.conRot = true;
		var fps = 60;
		xSpeed /= fps;
		ySpeed /= fps;
		zSpeed /= fps;
		that.rotSpeedVector = [xSpeed, ySpeed, zSpeed];
    }
	
	this.stopConstantRotation = function() {
		that.conRot = false;
	}
    
    this.scale = function(x, y, z, speed) {
	    var fps = 60;
		speed /= fps;
		that.scaling = true;
		that.newScale[0] = x;
		that.newScale[1] = y;
		that.newScale[2] = z;
		that.scaleSpeedVector = [(that.newScale[0] - that.size[0]) * speed, (that.newScale[1] - that.size[1]) * speed, (that.newScale[2] - that.size[2]) * speed];
		that.scaleSpeed = speed;
    }

    this.update = function() {
	if (that.translating) {
	  var distance = getDistance(that.pos, that.newPos);
	  if (distance <= that.moveSpeed) {
	    that.pos = that.newPos;
	    that.translating = false;
	  }
	  else {
	    that.pos[0] += that.velVector[0];
	    that.pos[1] += that.velVector[1];
	    that.pos[2] += that.velVector[2];
	  }
	}
	if (that.rotating) {
		if (Math.abs(that.newRot[0] - that.rot[0]) <= Math.abs(that.rotSpeedVector[0])) {
			that.rot[0] = that.newRot[0];
		}
		else {
			that.rot[0] += that.rotSpeedVector[0];
		}
		if (Math.abs(that.newRot[1] - that.rot[1]) <= Math.abs(that.rotSpeedVector[1])) {
			that.rot[1] = that.newRot[1];
		}
		else {
			that.rot[1] += that.rotSpeedVector[1];
		}
		if (Math.abs(that.newRot[2] - that.rot[2]) <= Math.abs(that.rotSpeedVector[2])) {
			that.rot[2] = that.newRot[2];
		}
		else {
			that.rot[2] += that.rotSpeedVector[2];
		}
		if (that.newRot == that.Rot) {
			that.rotating = false;
		}
		

	}
	if (that.conRot) {
		that.rot[0] += that.rotSpeedVector[0];
		if (that.rot[0] > (2 * Math.PI)) {
			that.rot[0] -= (2 * Math.PI);
		}
		else if (that.rot[0] < 0) {
			that.rot[0] += (2 * Math.PI);
		}
		that.rot[1] += that.rotSpeedVector[1];
		if (that.rot[1] > (2 * Math.PI)) {
			that.rot[1] -= (2 * Math.PI);
		}
		else if (that.rot[1] < 0) {
			that.rot[1] += (2 * Math.PI);
		}
		that.rot[2] += that.rotSpeedVector[2];
		if (that.rot[2] > (2 * Math.PI)) {
			that.rot[2] -= (2 * Math.PI);
		}
		else if (that.rot[2] < 0) {
			that.rot[2] += (2 * Math.PI);
		}
	}
	if (that.scaling) {
	  var distance = getDistance(that.size, that.newScale);
	  if (distance <= that.scaleSpeed) {
	    that.size = that.newScale;
	    that.scaling = false;
	  }
	  else {
	    that.size[0] += that.scaleSpeedVector[0];
	    that.size[1] += that.scaleSpeedVector[1];
	    that.size[2] += that.scaleSpeedVector[2];
	  }
	}
    }

    
    this.draw = function() {
		mvPushMatrix();
		mat4.translate(mvMatrix, [that.pos[0], that.pos[1], that.pos[2]]);
		mat4.rotate(mvMatrix, that.rot[0], [1.0, 0, 0]);
		mat4.rotate(mvMatrix, that.rot[1], [0, 1.0, 0]);
		mat4.rotate(mvMatrix, that.rot[2], [0, 0, 1.0]);
		mat4.scale(mvMatrix, [that.size[0], that.size[1], that.size[2]]);
		
		
		var shaderProgram = currentShader;
		gl.bindBuffer(gl.ARRAY_BUFFER, that.vertexBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, that.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			
		gl.bindBuffer(gl.ARRAY_BUFFER, that.normalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, that.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.uniform3f(shaderProgram.ambientColorUniform,ambientLight[0],ambientLight[1],ambientLight[2]);
		
		gl.uniform3f(shaderProgram.lightingLocationUniform, lightPos[0], lightPos[1], lightPos[2]);

		gl.uniform3f(shaderProgram.lightingDiffuseColorUniform,lightDiffColor[0],lightDiffColor[1],lightDiffColor[2]);
		gl.uniform3f(shaderProgram.lightingSpecularColorUniform,lightSpecColor[0],lightSpecColor[1],lightSpecColor[2]);
		gl.uniform1f(shaderProgram.materialShininessUniform, that.shininess);
		gl.uniform1i(shaderProgram.isLitUniform, that.ul);		
  
		
        gl.enable(gl.BLEND);
            
        gl.bindBuffer(gl.ARRAY_BUFFER, that.textCoordsBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, that.textCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);
            
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, that.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
            
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, that.indicesBuffer);
        setMatrixUniforms(shaderProgram);
        
		gl.drawArrays(gl.TRIANGLES, 0, that.vertexBuffer.numItems);


        if (that.isTextured) {
            gl.disable(gl.BLEND);
        }
		mvPopMatrix();
    }
}
