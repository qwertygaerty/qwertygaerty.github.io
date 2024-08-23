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
  // Define wave parameters
  float frequency = 10.0; // Frequency of the wave
  float amplitude = 0.4; // Amplitude of the wave
  float speed = 1.5; // Speed of the wave propagation

  // Calculate distance from the vertical line (origin point)
  vec2 origin = vec2(-1.0, 0.0); // Point from which the wave originates (left edge)
  float distanceFromOrigin = length(aPosition.yx - origin);

  // Compute wave displacement based on distance and time
  float wave = amplitude * sin(frequency * distanceFromOrigin - uTime * speed);

  // Apply wave displacement to the x-axis (rotated effect)
  vec4 displacedPosition = aPosition;
  displacedPosition.x += wave;

  // Set the final position
  gl_Position = uProjectionMatrix * uModelViewMatrix * displacedPosition;
  vUV = aUV;
}
`;

const fragmentShaderSource = `
precision mediump float;

varying vec2 vUV;

void main() {
  // Define colors for wave effect
  vec3 waveColor = vec3(0.0, 0.5, 1.0); // Bright blue color for the waves
  vec3 backgroundColor = vec3(1.0, 1.0, 1.0); // White background color
  
  // Smooth color gradient to highlight the wave effect
  float distanceFromCenter = length(vUV - 0.5);
  vec3 color = mix(backgroundColor, waveColor, exp(-distanceFromCenter * 30.0));
  
  gl_FragColor = vec4(color, 1.0);
}
`;

const canvas = document.getElementById('oceanCanvas') as HTMLCanvasElement;
const webGLContext = new Context(canvas);
const gl = webGLContext.getGL();

// Set background color to white
// gl.clearColor(1.0, 1.0, 1.0, 1.0); // RGBA (white)

// Compile and link shaders
const vertexShader = new Shader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = new Shader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = new Program(gl, vertexShader, fragmentShader);

program.use();

let gridSize = 50; // Initial grid size
let positions: number[] = [];
let uvs: number[] = [];

function generateGrid(size: number) {
    positions = [];
    uvs = [];

    for (let y = 0; y <= size; y++) {
        for (let x = 0; x <= size; x++) {
            const u = x / size;
            const v = y / size;
            positions.push(u * 2 - 1, v * 2 - 1, 0);
            uvs.push(u, v);
        }
    }
}

const slider = document.getElementById('gridSizeSlider') as HTMLInputElement;
slider.addEventListener('input', (event) => {
    gridSize = parseInt((event.target as HTMLInputElement).value, 10);
    generateGrid(gridSize);

    // Update buffers with the new grid data
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer.getBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer.getBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
});

generateGrid(gridSize);



const positionBuffer = new Buffer(gl, new Float32Array(positions));
const uvBuffer = new Buffer(gl, new Float32Array(uvs));

const aPositionLocation = gl.getAttribLocation(program.getProgram(), 'aPosition');
const aUVLocation = gl.getAttribLocation(program.getProgram(), 'aUV');
const uTimeLocation = gl.getUniformLocation(program.getProgram(), 'uTime');
const uModelViewMatrixLocation = gl.getUniformLocation(program.getProgram(), 'uModelViewMatrix');
const uProjectionMatrixLocation = gl.getUniformLocation(program.getProgram(), 'uProjectionMatrix');

const projectionMatrix = mat4.create();
const modelViewMatrix = mat4.create();

mat4.perspective(projectionMatrix, Math.PI / 4, canvas.clientWidth / canvas.clientHeight, 0.1, 100.0);
mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3]);

gl.uniformMatrix4fv(uProjectionMatrixLocation, false, projectionMatrix);
gl.uniformMatrix4fv(uModelViewMatrixLocation, false, modelViewMatrix);

// Render loop
function render(time: number) {
    webGLContext.resizeCanvasToDisplaySize();

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enableVertexAttribArray(aPositionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer.getBuffer());
    gl.vertexAttribPointer(aPositionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(aUVLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer.getBuffer());
    gl.vertexAttribPointer(aUVLocation, 3, gl.FLOAT, false, 0, 0);

    gl.uniform1f(uTimeLocation, time * 0.001);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, positions.length / 3);

    requestAnimationFrame(render);
}

render(0);