define(['gl/gl-version', 'gl/gl-matrix', 'gl/shaders/fragment', 'gl/shaders/vertex'], function (webGlVersion, glMatrix, fragmentShaderScript, vertexShaderScript) {

	var mat4 = glMatrix.mat4,
		pMatrix = mat4.create(),
		mvMatrix = mat4.create();
	
	function initGl(canvas) {
		var gl;
		
		try {
			gl = canvas.getContext(webGlVersion);
			gl.viewportWidth = canvas.width;
			gl.viewportHeight = canvas.height;
		}
		catch (e) {
		}
		if (!gl) {
			alert('Failed... use most recent version of Chrome :/');
		}
		
		return gl;
	}
	
	
	function createShader(gl, type, shaderScript) {
		var shader;
		shader = gl.createShader(type);

        gl.shaderSource(shader, shaderScript);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
	}
	
	
	function createShaderProgram(gl) {
		var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderScript),
			vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderScript),
			shaderProgram = gl.createProgram();
			
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert('fail.  Could not init shaders');
		}
		
		gl.useProgram(shaderProgram);
		
		shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
		gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
		
		shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
		shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
		
		return shaderProgram;
	}
	
	
	function createSurfaceBuffer(gl, verticies) {
		var vertexPositionBuffer = gl.createBuffer();
		
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticies), gl.STATIC_DRAW);
		vertexPositionBuffer.itemSize = 3;
		vertexPositionBuffer.numItems = verticies.length / 3;
		
		return vertexPositionBuffer;
	}
	
	
	function drawSurface(gl, surfaceBuffer, position, shaderProgram) {
		mat4.identity(mvMatrix);

        mat4.translate(mvMatrix, position);
        gl.bindBuffer(gl.ARRAY_BUFFER, surfaceBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, surfaceBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
		gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
		
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, surfaceBuffer.numItems);
	}
	
	function clearScene(gl) {
		gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	}
	
	
	// public interface
	return {
		// initialization
		initGl: initGl,
		createShaderProgram: createShaderProgram,
		createSurfaceBuffer: createSurfaceBuffer,
		
		// drawing
		drawSurface: drawSurface,
		clearScene: clearScene
	};
});