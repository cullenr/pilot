precision mediump float;

// our texture
uniform sampler2D u_image;
uniform sampler2D u_noise;
uniform float     u_time;

// the texCoords passed in from the vertex shader.
varying vec2 v_texcoord;

void main() {
	float xAmp  = 0.1; 
    float xFreq = 1.0;
    float xPhase = u_time * 0.8;
    
    float yAmp  = 0.1; 
    float yFreq = 1.0;
    float yPhase = u_time * 0.8;

	vec2 uv = v_texcoord;
	vec2 offset = vec2(uv.x + sin(uv.y * xFreq + xPhase) * xAmp, 
                       uv.y + sin(uv.x * yFreq + yPhase) * yAmp);
 
    gl_FragColor = texture2D(u_image, offset);
}
