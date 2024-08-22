import './style.css'

import { mat4 } from 'gl-matrix';

const canvas = document.getElementById('oceanCanvas') as HTMLCanvasElement;
const gl = canvas.getContext('webgl')!;

function initGL() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}

// Vertex Shader Code
const vertexShaderSource = `
    attribute vec4 position;
    attribute vec3 normal;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform float time;
    varying float vWave;
    void main() {
        float wave = cos(position.x * 1.0 + time) * 0.5; // Adjust frequency and amplitude
        vec3 displacedPosition = position.xyz + normal * wave;
        vWave = wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 0.5);
    }
`;

// Fragment Shader Code
const fragmentShaderSource = `
    precision mediump float;
    varying float vWave;
    void main() {
        gl_FragColor = vec4(0.0, 0.5 + 0.5 * vWave, 0.5, 1.5);
    }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        throw new Error('Shader compilation failed');
    }
    return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        throw new Error('Program linking failed');
    }
    return program;
}

function initShaders() {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    const normalAttributeLocation = gl.getAttribLocation(program, 'normal');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
        // Vertices of a grid.
        -1, -1,  0,  0, 0, 1,
        1, -1,  0,  0, 0, 1,
        -1,  1,  0,  0, 0, 1,
        1,  1,  0,  0, 0, 1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 6 * 4, 0);

    gl.enableVertexAttribArray(normalAttributeLocation);
    gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

    const timeUniformLocation = gl.getUniformLocation(program, 'time');
    const projectionMatrixLocation = gl.getUniformLocation(program, 'projectionMatrix');
    const modelViewMatrixLocation = gl.getUniformLocation(program, 'modelViewMatrix');

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 0.1, 100.0);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -10]); // Move the wave further away
    mat4.rotate(modelViewMatrix, modelViewMatrix, Math.PI, [1, 0, 0]); // Rotate the wave 45 degrees around the X-axis
    gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);

    let lastTime = 0;

    function render(now: number) {
        // @ts-ignore
        const deltaTime = now - lastTime;
        lastTime = now;
        gl.uniform1f(timeUniformLocation, now * 0.01); // Pass the current time in seconds
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

initGL();
initShaders();