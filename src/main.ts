import './style.css'
import {Context} from "./application/webgl/context.ts";
import {Shader} from "./application/webgl/shader.ts";
import {Program} from "./application/webgl/program.ts";
import { mat4 } from 'gl-matrix';
import {Buffer} from "./application/webgl/buffer.ts";

// Vertex Shader Code
const vertexShaderSource = `
attribute vec4 aPosition;
attribute vec2 aUV;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;

varying vec2 vUV;

void main() {
  // Define the wave parameters
  float frequency1 = 4.0;
  float amplitude1 = 0.05;
  float frequency2 = 2.0;
  float amplitude2 = 0.03;
  float speed = 0.6;
  
  // Combine multiple sine waves for realistic waveforms
  float wave = sin(frequency1 * aPosition.x + uTime * speed) * amplitude1 +
               sin(frequency2 * (aPosition.x + aPosition.y) + uTime * speed * 0.8) * amplitude2;

  // Apply wave displacement to the y-axis
  vec4 displacedPosition = aPosition;
  displacedPosition.z += wave;

  // Set the final position
  gl_Position = uProjectionMatrix * uModelViewMatrix * displacedPosition;
  vUV = aUV;
}
`;

// Fragment Shader Code
const fragmentShaderSource = `
precision mediump float;

varying vec2 vUV;

void main() {
  // Smooth color gradient to simulate water
  vec3 deepWaterColor = vec3(1, 1, 1);
  vec3 shallowWaterColor = vec3(0.0, 0.5, 0.7);
  
  // Interpolate color based on UV y-coordinate for a water gradient
  vec3 waterColor = mix(deepWaterColor, shallowWaterColor, vUV.y);
  
  gl_FragColor = vec4(waterColor, 1.0);
}
`;

const canvas = document.getElementById('oceanCanvas') as HTMLCanvasElement;
const webGLContext = new Context(canvas);
const gl = webGLContext.getGL();

gl.clearColor(0, 0, 0, 1.0);

// Compile and link shaders
const vertexShader = new Shader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = new Program(gl, vertexShader, fragmentShader);

program.use();

// Define grid with updated resolution and coverage
const gridSize = 999;
const positions = [];
const uvs = [];

for (let y = 0; y <= gridSize; y++) {
    for (let x = 0; x <= gridSize; x++) {
        const u = x / gridSize;
        const v = y / gridSize;
        positions.push(u * 2 - 1, v * 2 - 1, 0);
        uvs.push(u, v);
    }
}

const positionBuffer = new Buffer(gl, new Float32Array(positions));
const uvBuffer = new Buffer(gl, new Float32Array(uvs));

// Setup attribute pointers
const aPositionLocation = gl.getAttribLocation(program.getProgram(), 'aPosition');
gl.enableVertexAttribArray(aPositionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer.getBuffer());
gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 0, 0);

const aUVLocation = gl.getAttribLocation(program.getProgram(), 'aUV');
gl.enableVertexAttribArray(aUVLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer.getBuffer());
gl.vertexAttribPointer(aUVLocation, 2, gl.FLOAT, false, 0, 0);

// Setup uniforms
const uTimeLocation = gl.getUniformLocation(program.getProgram(), 'uTime');
const uModelViewMatrixLocation = gl.getUniformLocation(program.getProgram(), 'uModelViewMatrix');
const uProjectionMatrixLocation = gl.getUniformLocation(program.getProgram(), 'uProjectionMatrix');

// Setup projection and view matrices
const projectionMatrix = mat4.create();
const modelViewMatrix = mat4.create();

mat4.perspective(projectionMatrix, Math.PI / 4, canvas.clientWidth / canvas.clientHeight, 0.1, 100.0);
mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -1]);

gl.uniformMatrix4fv(uProjectionMatrixLocation, false, projectionMatrix);
gl.uniformMatrix4fv(uModelViewMatrixLocation, false, modelViewMatrix);

// Rendering loop
function render(time: number) {
    webGLContext.resizeCanvasToDisplaySize();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform1f(uTimeLocation, time * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, positions.length / 3);

    requestAnimationFrame(render);
}

render(0);