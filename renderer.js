(function(){
	function main() {
		const canvas = document.getElementById("canvas");
		const gl = canvas.getContext("webgl");
		
        if(!gl) {
			console.log("no webgl mate, sorry.")
			return;
		}
	
		webglUtils.resizeCanvasToDisplaySize(gl.canvas);	
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	
		const square = [0.0,0.0, 1.0,0.0, 0.0,1.0, 0.0,1.0, 1.0,0.0, 1.0,1.0];
        const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, {
            texcoord: { numComponents: 2, data: square },
            position: { numComponents: 2, data: square.map(e => e * 768) }
        });
		
		const globalUniforms = { 
        	u_time: 0,
			u_resolution: [gl.canvas.width, gl.canvas.height]
        };
       
		Promise.all([
			loadRadarShader(gl)
			//loadCrtShader(gl)
		]).then(shaders => {
			let then = 0;
			const render = (time) => {
				const now = time * 0.001;
				const deltaTime = Math.min(0.1, now - then);
				then = now;
			
				globalUniforms.u_time = now;
	
				gl.clearColor(0, 1, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);

                shaders[0](globalUniforms, bufferInfo);	
                
                gl.drawArrays(gl.TRIANGLES, 0, 6);

				requestAnimationFrame(render);
			}
  			
			requestAnimationFrame(render);
		}).catch(console.error.bind(console))
	}

    function fetchImage(url) {
        return new Promise((resolve, reject) => {
            const image = document.createElementNS("http://www.w3.org/1999/xhtml", "img");
            image.addEventListener("error", reject);
            image.addEventListener("load", () => resolve(image));
            image.src = url;
        });
    } 

	function loadRadarShader(gl) {
        return Promise.all([
            fetch("./radar.vert").then(res => res.text()),
            fetch("./radar.frag").then(res => res.text()),
            fetchImage("./radar.png"),
            fetchImage("./noise.png")
        ]).then(res => {
            const programInfo = webglUtils.createProgramInfo(gl, [res[0], res[1]]);
            
            const textures = res.slice(2).map(image => {
                const texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);

                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            
                return texture;
            });
            
			const uniforms = { 
                u_image: textures[0],
                u_noise: textures[1]
            };
			
			// lose the references to the assets we loaded otherise the
			// callback we create below will retain a reference.
			res = undefined;
 
            return (globalUniforms, bufferInfo) => {
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, textures[0]);
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, textures[1]);
                
				gl.useProgram(programInfo.program);
                
				webglUtils.setBuffersAndAttributes(gl, programInfo, bufferInfo);
                webglUtils.setUniforms(programInfo, globalUniforms);
                webglUtils.setUniforms(programInfo, uniforms);
            };
        });
	}

	main();
})();
