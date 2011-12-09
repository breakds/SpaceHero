var PlanetView = function( m ) {
    this.setModel( m );
    /// Do register a view on stage !!!
    this.register( solarSystem );
	
	var resolution = 100.0;
	
	var vertices = new Array();
	var colors = new Array();
	
	for(var i = 0.0; i < resolution; i++)
	{
		vertices.push(this.model.orbitAround.position[0] + this.model.orbitRadius * Math.sin(2.0 * Math.PI * i / resolution));
		vertices.push(this.model.orbitAround.position[1] + this.model.orbitRadius * Math.cos(2.0 * Math.PI * i / resolution));
		vertices.push(this.model.orbitAround.position[2]);
		colors.push(1.0);
		colors.push(1.0);
		colors.push(1.0);
		colors.push(0.2);
	}
	
	this.circleVertexBuffer = gl.createBuffer();
	this.circleColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.circleVertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.circleColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	this.circleVertexBuffer.itemSize = 3;
	this.circleVertexBuffer.numItems = resolution;
	this.circleColorBuffer.itemSize = 4;
	this.circleColorBuffer.numItems = resolution;
    
    this.draw = function()
	{
		setShader(notShaderProgram);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.circleVertexBuffer);
		gl.vertexAttribPointer(notShaderProgram.vertexPositionAttribute, this.circleVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.circleColorBuffer);
		gl.vertexAttribPointer(notShaderProgram.vertexColorAttribute, this.circleColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
		setMatrixUniforms(notShaderProgram);
		gl.drawArrays(gl.LINE_LOOP, 0, this.circleVertexBuffer.numItems);
		setShader(lightShaderProgram);
		this.model.planetModel.update();
		this.model.planetModel.draw();
		if (this.model.hasAtmos)
		{
			this.model.atmosModel.update();
			this.model.atmosModel.draw();
		}
    }
}
PlanetView.prototype = new View();


var Planet = function(pTexture, aTexture, x, y, z, radius, orbitRadius, orbitAround)
{
	this.position = vec3.create();
	this.position[0] = x;
	this.position[1] = y;
	this.position[2] = z;
    this.radius = radius;
	this.hasAtmos = false;
	this.radius = radius;
	this.planetModel = new Model("ball.obj", pTexture);
	this.planetModel.setPosition(x,y,z);
	this.planetModel.setScale(radius,radius,radius);
	this.planetModel.constantRotation(0,0,0.4);
	if (aTexture != null) {
		this.hasAtmos = true;
		this.atmosModel = new Model("ball.obj", aTexture);
		this.atmosModel.setPosition(this.x,this.y,this.z);
		this.atmosModel.setScale(radius * 1.1, radius * 1.1, radius * 1.1);
		this.atmosModel.constantRotation(0,0,0.7);
	}

    /// do init a game object before using it
    this.init();
	
	this.orbitRadius = orbitRadius;
	this.orbitAround = orbitAround; // set this equal to the star around which the planet orbits
	this.orbitPosition = Math.random() * Math.PI * 2; // start the planet at a random point around the star
    this.update = function()
	{
		if(this.orbitAround)
		{
			this.position[0] = this.orbitAround.position[0] - this.orbitRadius * Math.sin(this.orbitPosition);
			this.position[1] = this.orbitAround.position[1] + this.orbitRadius * Math.cos(this.orbitPosition);
			this.position[2] = this.orbitAround.position[2];
			this.planetModel.setPosition(this.position[0],this.position[1],this.position[2]);
			this.orbitPosition += this.orbitVelocity;
			if(this.hasAtmos)
			{
				this.atmosModel.setPosition(this.position[0],this.position[1],this.position[2]);
			}
		}
    }
	
    /// Add a View:
    this.addView( new PlanetView( this ) );
	
	this.buildings = new Array(); // array of strings that list the buildings on this planet
}
Planet.prototype = new GameObject();