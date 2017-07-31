(function(){
	function main() {
		var canvas = document.getElementById("canvas");
		var gl = canvas.getContext("webgl");
		if (!gl) {
			console.log("no webgl mate, sorry.")
			return;
		}
		
		webglUtils.resizeCanvasToDisplaySize(gl.canvas);	
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


		var image = new Image();
		image.src = "./radar.jpg";  // MUST BE SAME DOMAIN!!!
		image.onload = function() {
			var pass = init(gl, image);
			var render = function render() {
				window.requestAnimationFrame(render, canvas);

				gl.clearColor(0, 1, 0, 0);
				gl.clear(gl.COLOR_BUFFER_BIT);

				pass();	

				// Draw the rectangle.
				gl.drawArrays(gl.TRIANGLES, 0, 6);
			};	
			
			render();
		};
	}

	function init(gl, image) {
		var programInfo = webglUtils.createProgramInfo(gl, ["vertex-shader", "fragment-shader"]);
		
		var square = [0.0,0.0, 1.0,0.0, 0.0,1.0, 0.0,1.0, 1.0,0.0, 1.0,1.0];
		var bufferInfo = webglUtils.createBufferInfoFromArrays(gl, {
			texcoord: { numComponents: 2, data: square},
			position: { numComponents: 2, data: square.map(e => e * 768)}
		});

		var uniforms = { 
			u_resolution: [gl.canvas.width, gl.canvas.height]
		};

		// Create a texture.
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// Set the parameters so we can render any size image.
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		// Upload the image into the texture.
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		return function() {
			gl.useProgram(programInfo.program);
			webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
			webglUtils.setUniforms(programInfo, uniforms);
		};
	}

	main();
})();
