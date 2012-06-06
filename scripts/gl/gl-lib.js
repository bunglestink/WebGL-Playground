define(['gl/gl-version', 'gl/shaders/fragment', 'gl/shaders/vertex'], function (webGlVersion, fragmentShaderScript, vertexShaderScript) {
	
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
	
	
	// public interface
	return {
		initGl: initGl,
		createShaderProgram: createShaderProgram
	};
});