export class Shader {
    private gl: WebGLRenderingContext;
    private shader: WebGLShader;

    constructor(gl: WebGLRenderingContext, type: GLenum, source: string) {
        this.gl = gl;
        this.shader = this.createShader(type, source);
    }

    private createShader(type: GLenum, source: string): WebGLShader {
        const shader = this.gl.createShader(type);
        if (!shader) {
            throw new Error("Unable to create shader.");
        }

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const error = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error(`Error compiling shader: ${error}`);
        }

        return shader;
    }

    public getShader(): WebGLShader {
        return this.shader;
    }
}