export class Buffer {
    private gl: WebGLRenderingContext;
    private buffer: WebGLBuffer | null;

    constructor(gl: WebGLRenderingContext, data: Float32Array, usage: GLenum = gl.STATIC_DRAW) {
        this.gl = gl;
        this.buffer = this.gl.createBuffer();
        if (!this.buffer) {
            throw new Error("Unable to create buffer.");
        }
        this.bind();
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, usage);
    }

    public bind(): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    }

    public getBuffer(): WebGLBuffer | null {
        return this.buffer;
    }
}