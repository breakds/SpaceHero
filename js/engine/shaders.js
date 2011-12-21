
function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
			console.log("Shader not found");
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
    
    function setShader(shaderProgram)
	{
		if(shaderProgram == lightShaderProgram)
		{
			gl.disableVertexAttribArray(notShaderProgram.vertexPositionAttribute);
			gl.disableVertexAttribArray(notShaderProgram.vertexColorAttribute);
			gl.enableVertexAttribArray(lightShaderProgram.vertexPositionAttribute);
			gl.enableVertexAttribArray(lightShaderProgram.vertexNormalAttribute);
			gl.enableVertexAttribArray(lightShaderProgram.textureCoordAttribute);
		}
		if(shaderProgram == notShaderProgram)
		{
			gl.disableVertexAttribArray(lightShaderProgram.vertexPositionAttribute);
			gl.disableVertexAttribArray(lightShaderProgram.vertexNormalAttribute);
			gl.disableVertexAttribArray(lightShaderProgram.textureCoordAttribute);
			gl.enableVertexAttribArray(notShaderProgram.vertexPositionAttribute);
			gl.enableVertexAttribArray(notShaderProgram.vertexColorAttribute);
		}
		currentShader = shaderProgram;
		gl.useProgram(currentShader);
    }

    function initShaders()
	{
        // Light Shader
        var lightFragmentShader = getShader(gl, "light-shader-fs");
        var lightVertexShader = getShader(gl, "light-shader-vs");
        
        lightShaderProgram = gl.createProgram();
        gl.attachShader(lightShaderProgram, lightVertexShader);
        gl.attachShader(lightShaderProgram, lightFragmentShader);
        gl.linkProgram(lightShaderProgram);
        
        if (!gl.getProgramParameter(lightShaderProgram, gl.LINK_STATUS)) {
            console.log("Could not initialise shaders");
        }
        
		lightShaderProgram.vertexPositionAttribute = gl.getAttribLocation(lightShaderProgram, "aVertexPosition");

        lightShaderProgram.vertexNormalAttribute = gl.getAttribLocation(lightShaderProgram, "aVertexNormal");

        lightShaderProgram.textureCoordAttribute = gl.getAttribLocation(lightShaderProgram, "aTextureCoord");
		
        lightShaderProgram.pMatrixUniform = gl.getUniformLocation(lightShaderProgram, "uPMatrix");
        lightShaderProgram.mvMatrixUniform = gl.getUniformLocation(lightShaderProgram, "uMVMatrix");
		lightShaderProgram.mvCameraUniform = gl.getUniformLocation(lightShaderProgram, "uMVCamera");
		lightShaderProgram.mvLightingUniform = gl.getUniformLocation(lightShaderProgram, "uMVLighting");
		lightShaderProgram.nMatrixUniform = gl.getUniformLocation(lightShaderProgram, "uNMatrix");
        lightShaderProgram.samplerUniform = gl.getUniformLocation(lightShaderProgram, "uSampler");
		lightShaderProgram.materialShininessUniform = gl.getUniformLocation(lightShaderProgram, "uMaterialShininess");
		lightShaderProgram.ambientColorUniform = gl.getUniformLocation(lightShaderProgram, "uAmbientColor");
        lightShaderProgram.lightingLocationUniform = gl.getUniformLocation(lightShaderProgram, "uLightingLocation");
        lightShaderProgram.lightingDiffuseColorUniform = gl.getUniformLocation(lightShaderProgram, "uLightingDiffuseColor");
		lightShaderProgram.lightingSpecularColorUniform = gl.getUniformLocation(lightShaderProgram, "uLightingSpecularColor");
		lightShaderProgram.isLitUniform = gl.getUniformLocation(lightShaderProgram, "uIsLit");
		
		// Not Light Shader
		var notVertexShader = getShader(gl, "shader-vs");
		var notFragmentShader = getShader(gl, "shader-fs");
		
		notShaderProgram = gl.createProgram();
		gl.attachShader(notShaderProgram, notVertexShader);
		gl.attachShader(notShaderProgram, notFragmentShader);
		gl.linkProgram(notShaderProgram);
		
        if (!gl.getProgramParameter(lightShaderProgram, gl.LINK_STATUS)) {
            console.log("Could not initialise shaders");
        }
		
		notShaderProgram.vertexPositionAttribute = gl.getAttribLocation(notShaderProgram, "aVertexPosition");
		notShaderProgram.vertexColorAttribute = gl.getAttribLocation(notShaderProgram, "aVertexColor");
		notShaderProgram.pMatrixUniform = gl.getUniformLocation(notShaderProgram, "uPMatrix");
		notShaderProgram.mvMatrixUniform = gl.getUniformLocation(notShaderProgram, "uMVMatrix");
    }
