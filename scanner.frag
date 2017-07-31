void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float xAmp  = 0.1; 
    float xFreq = 8.0;
    float xPhase = iTime * 0.8;
    
    float yAmp  = 0.1; 
    float yFreq = 8.0;
    float yPhase = iTime * 0.8;
    
    vec2 uv = fragCoord.xy / iResolution.xy;
    
	vec2 offset = vec2(uv.x + sin(uv.y * xFreq + xPhase) * xAmp, 
                       uv.y + sin(uv.x * yFreq + yPhase) * yAmp);
    
    fragColor = texture(iChannel0, offset);
}
