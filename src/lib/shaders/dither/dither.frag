#version 300 es 
precision highp float;

// The image texture
uniform sampler2D uTexture;

// Dithering intensity (0.0 = no dithering, 1.0 = full dithering)
uniform float uIntensity;

// Color levels per channel (e.g., 16.0 for 4-bit per channel)
uniform float uLevels;

// Dither matrix size (4 for 4x4, 8 for 8x8)
uniform float uMatrixSize;

// The texture coordinates passed from the vertex shader
in vec2 vTextureCoord;

out vec4 fragColor;

// 4x4 Bayer matrix (scaled to 0-1 range)
const mat4 bayerMatrix4x4 = mat4(
    0.0/16.0,  8.0/16.0,  2.0/16.0, 10.0/16.0,
   12.0/16.0,  4.0/16.0, 14.0/16.0,  6.0/16.0,
    3.0/16.0, 11.0/16.0,  1.0/16.0,  9.0/16.0,
   15.0/16.0,  7.0/16.0, 13.0/16.0,  5.0/16.0
);

// 8x8 Bayer matrix (scaled to 0-1 range)
const mat4 bayerMatrix8x8[4] = mat4[4](
    mat4(
         0.0/64.0, 32.0/64.0,  8.0/64.0, 40.0/64.0,
        48.0/64.0, 16.0/64.0, 56.0/64.0, 24.0/64.0,
        12.0/64.0, 44.0/64.0,  4.0/64.0, 36.0/64.0,
        60.0/64.0, 28.0/64.0, 52.0/64.0, 20.0/64.0
    ),
    mat4(
         2.0/64.0, 34.0/64.0, 10.0/64.0, 42.0/64.0,
        50.0/64.0, 18.0/64.0, 58.0/64.0, 26.0/64.0,
        14.0/64.0, 46.0/64.0,  6.0/64.0, 38.0/64.0,
        62.0/64.0, 30.0/64.0, 54.0/64.0, 22.0/64.0
    ),
    mat4(
         3.0/64.0, 35.0/64.0, 11.0/64.0, 43.0/64.0,
        51.0/64.0, 19.0/64.0, 59.0/64.0, 27.0/64.0,
        15.0/64.0, 47.0/64.0,  7.0/64.0, 39.0/64.0,
        63.0/64.0, 31.0/64.0, 55.0/64.0, 23.0/64.0
    ),
    mat4(
         1.0/64.0, 33.0/64.0,  9.0/64.0, 41.0/64.0,
        49.0/64.0, 17.0/64.0, 57.0/64.0, 25.0/64.0,
        13.0/64.0, 45.0/64.0,  5.0/64.0, 37.0/64.0,
        61.0/64.0, 29.0/64.0, 53.0/64.0, 21.0/64.0
    )
);

float getBayerValue4x4(vec2 screenPos) {
    int x = int(mod(screenPos.x, 4.0));
    int y = int(mod(screenPos.y, 4.0));
    return bayerMatrix4x4[x][y];
}

float getBayerValue8x8(vec2 screenPos) {
    int x = int(mod(screenPos.x, 8.0));
    int y = int(mod(screenPos.y, 8.0));
    
    // Get the appropriate matrix based on position
    int matrixIndex = (x / 4) + (y / 4) * 2;
    int localX = x % 4;
    int localY = y % 4;
    
    return bayerMatrix8x8[matrixIndex][localX][localY];
}

vec3 dither(vec3 color, float threshold) {
    if (uLevels <= 1.0) {
        return color;
    }
    
    // Calculate the number of levels minus 1
    float levels = uLevels - 1.0;
    
    // Scale color to level range
    vec3 scaledColor = color * levels;
    
    // Get the lower and upper bounds
    vec3 lowerBound = floor(scaledColor);
    vec3 upperBound = lowerBound + 1.0;
    
    // Calculate the fractional part
    vec3 fraction = scaledColor - lowerBound;
    
    // Apply dithering threshold
    vec3 dithered = mix(lowerBound, upperBound, step(threshold, fraction));
    
    // Scale back to 0-1 range
    return dithered / levels;
}

void main() {
    // Sample the original color from the texture
    vec4 originalColor = texture(uTexture, vTextureCoord);
    
    // If intensity is 0, return original color
    if (uIntensity <= 0.0) {
        fragColor = originalColor;
        return;
    }
    
    // Get screen position for dither pattern
    vec2 screenPos = gl_FragCoord.xy;
    
    // Get Bayer threshold value
    float bayerValue;
    if (uMatrixSize <= 4.0) {
        bayerValue = getBayerValue4x4(screenPos);
    } else {
        bayerValue = getBayerValue8x8(screenPos);
    }
    
    // Apply dithering
    vec3 ditheredColor = dither(originalColor.rgb, bayerValue);
    
    // Mix between original and dithered based on intensity
    vec3 finalColor = mix(originalColor.rgb, ditheredColor, uIntensity);
    
    // Set the final color, keeping the original alpha
    fragColor = vec4(finalColor.rgb, originalColor.a);
}
