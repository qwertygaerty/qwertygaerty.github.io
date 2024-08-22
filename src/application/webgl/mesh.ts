import {Buffer} from "./buffer.ts";

export class Mesh {
    private gl: WebGLRenderingContext;
    private positionBuffer: Buffer;

    constructor(gl: WebGLRenderingContext, positions: Float32Array) {
        this.gl = gl;
        this.positionBuffer = new Buffer(gl, positions);
    }

    public draw(): void {
        this.positionBuffer.bind();
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);  // Example: drawing a triangle
    }
}