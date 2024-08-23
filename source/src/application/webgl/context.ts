export class Context {
    private canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const gl = this.canvas.getContext("webgl");
        if (!gl) {
            throw new Error("WebGL is not supported by this browser.");
        }
        this.gl = gl;
        this.initialize();
    }

    private initialize(): void {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }

    public getGL(): WebGLRenderingContext {
        return this.gl;
    }

    public resizeCanvasToDisplaySize(): void {
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;

        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}