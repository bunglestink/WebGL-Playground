define(['gl/gl-lib', 'gl/gl-matrix'], function (glLib, glMatrix) {
	var distance = -7.0,
		direction = -100,
		triangleVerticies = [
			0.0,	1.0,	0.0,
			1.0,	-1.0,	0.0,
			-1.0,	-1.0,	0.0
		],
		squareVerticies = [
			1.0,	1.0,	0.0,
			-1.0,	1.0,	0.0,
			1.0,	-1.0,	0.0,
			-1.0,	-1.0,	0.0
		],
		canvas, gl, shaderProgram, triangleVertexPositionBuffer, squareVertexPositionBuffer, mainLoopInterval;
	
	
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
        glLib.clearScene(gl);
        glLib.drawSurface(gl, triangleVertexPositionBuffer, [-1.5, 0.0, distance], shaderProgram);
		glLib.drawSurface(gl, squareVertexPositionBuffer, [1.5, (distance/10)+5, -10.0], shaderProgram);
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
			triangleVertexPositionBuffer = glLib.createSurfaceBuffer(gl, triangleVerticies);
			squareVertexPositionBuffer = glLib.createSurfaceBuffer(gl, squareVerticies);
		},
		
		run: function () {
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.enable(gl.DEPTH_TEST);
			
			lastTime = new Date().getTime();
			lastTime = mainLoop(gl, lastTime);
			mainLoopInterval = setInterval(function () {
				lastTime = mainLoop(gl, lastTime);
			}, 1);
		},
		
		stop: function () {
			clearInterval(mainLoopInterval);
		}
	};
});