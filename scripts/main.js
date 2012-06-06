define(['gl/gl-lib', 'gl/gl-matrix'], function (glLib, glMatrix) {
	var mat4 = glMatrix.mat4,
		pMatrix = mat4.create(),
		mvMatrix = mat4.create(),
		distance = -7.0,
		direction = -100,
		canvas, gl, shaderProgram, triangleVertexPositionBuffer;
	
	function createTriangleBuffer(gl) {
		var vertexPositionBuffer = gl.createBuffer(),
			verticies = [
				0.0,	1.0,	0.0,
				-1.0,	-1.0,	0.0,
				1.0,	-1.0,	0.0
			];
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);
		vertexPositionBuffer.itemSize = 3;
		vertexPositionBuffer.numItems = 3;
		
		return vertexPositionBuffer;
	}
	
	
	function updateScene(timeElapsed) {
		if (distance < -100) {
			distance = -100;
			direction *= -1;
		}
		if (distance > -1) {
			distance = -1;
			direction *= -1;
		}

		distance += (direction * timeElapsed);
	}
	
	
	function drawScene(gl) {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

        mat4.identity(mvMatrix);

        mat4.translate(mvMatrix, [-1.5, 0.0, distance]);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
		
        gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
    }
	
	
	function mainLoop(gl, lastTime) {
		var time = new Date().getTime()
			secondsChanged = (time - lastTime) / 1000;
			
		updateScene(secondsChanged);		
		drawScene(gl);
		
		return time;
	}
	
	return {
		init: function (target) {
			var lastTime;
			
			canvas = target;
			gl = glLib.initGl(canvas);
			shaderProgram = glLib.createShaderProgram(gl);
			triangleVertexPositionBuffer = createTriangleBuffer(gl);
		},
		
		run: function () {
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.enable(gl.DEPTH_TEST);
			
			lastTime = new Date().getTime();
			lastTime = mainLoop(gl, lastTime);
			setInterval(function () {
				lastTime = mainLoop(gl, lastTime);
			}, 1);
		}
	};
});