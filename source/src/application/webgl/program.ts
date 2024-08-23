import {Shader} from "./shader.ts";

export class Program {
    private gl: WebGLRenderingContext;
    private program: WebGLProgram;

    constructor(gl: WebGLRenderingContext, vertexShader: Shader, fragmentShader: Shader) {
        this.gl = gl;
        this.program = this.createProgram(vertexShader, fragmentShader);
    }

    private createProgram(vertexShader: Shader, fragmentShader: Shader): WebGLProgram {
        const program = this.gl.createProgram();
        if (!program) {
            throw new Error("Unable to create program.");
        }

        this.gl.attachShader(program, vertexShader.getShader());
        this.gl.attachShader(program, fragmentShader.getShader());
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            const error = this.gl.getProgramInfoLog(program);
            this.gl.deleteProgram(program);
            throw new Error(`Error linking program: ${error}`);
        }

        return program;
    }

    public use(): void {
        this.gl.useProgram(this.program);
    }

    public getProgram(): WebGLProgram {
        return this.program;
    }
}