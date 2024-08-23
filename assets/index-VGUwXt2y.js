var D=Object.defineProperty;var Y=(e,t,a)=>t in e?D(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a;var c=(e,t,a)=>Y(e,typeof t!="symbol"?t+"":t,a);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function a(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(o){if(o.ep)return;o.ep=!0;const n=a(o);fetch(o.href,n)}})();class W{constructor(t){c(this,"canvas");c(this,"gl");this.canvas=t;const a=this.canvas.getContext("webgl");if(!a)throw new Error("WebGL is not supported by this browser.");this.gl=a,this.initialize()}initialize(){this.gl.clearColor(0,0,0,1),this.gl.clear(this.gl.COLOR_BUFFER_BIT)}getGL(){return this.gl}resizeCanvasToDisplaySize(){const t=this.canvas.clientWidth,a=this.canvas.clientHeight;(this.canvas.width!==t||this.canvas.height!==a)&&(this.canvas.width=t,this.canvas.height=a,this.gl.viewport(0,0,this.canvas.width,this.canvas.height))}}class L{constructor(t,a,r){c(this,"gl");c(this,"shader");this.gl=t,this.shader=this.createShader(a,r)}createShader(t,a){const r=this.gl.createShader(t);if(!r)throw new Error("Unable to create shader.");if(this.gl.shaderSource(r,a),this.gl.compileShader(r),!this.gl.getShaderParameter(r,this.gl.COMPILE_STATUS)){const o=this.gl.getShaderInfoLog(r);throw this.gl.deleteShader(r),new Error(`Error compiling shader: ${o}`)}return r}getShader(){return this.shader}}class G{constructor(t,a,r){c(this,"gl");c(this,"program");this.gl=t,this.program=this.createProgram(a,r)}createProgram(t,a){const r=this.gl.createProgram();if(!r)throw new Error("Unable to create program.");if(this.gl.attachShader(r,t.getShader()),this.gl.attachShader(r,a.getShader()),this.gl.linkProgram(r),!this.gl.getProgramParameter(r,this.gl.LINK_STATUS)){const o=this.gl.getProgramInfoLog(r);throw this.gl.deleteProgram(r),new Error(`Error linking program: ${o}`)}return r}use(){this.gl.useProgram(this.program)}getProgram(){return this.program}}var E=typeof Float32Array<"u"?Float32Array:Array;Math.hypot||(Math.hypot=function(){for(var e=0,t=arguments.length;t--;)e+=arguments[t]*arguments[t];return Math.sqrt(e)});function T(){var e=new E(16);return E!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function N(e,t,a){var r=a[0],o=a[1],n=a[2],s,g,d,m,u,v,p,w,A,b,y,P;return t===e?(e[12]=t[0]*r+t[4]*o+t[8]*n+t[12],e[13]=t[1]*r+t[5]*o+t[9]*n+t[13],e[14]=t[2]*r+t[6]*o+t[10]*n+t[14],e[15]=t[3]*r+t[7]*o+t[11]*n+t[15]):(s=t[0],g=t[1],d=t[2],m=t[3],u=t[4],v=t[5],p=t[6],w=t[7],A=t[8],b=t[9],y=t[10],P=t[11],e[0]=s,e[1]=g,e[2]=d,e[3]=m,e[4]=u,e[5]=v,e[6]=p,e[7]=w,e[8]=A,e[9]=b,e[10]=y,e[11]=P,e[12]=s*r+u*o+A*n+t[12],e[13]=g*r+v*o+b*n+t[13],e[14]=d*r+p*o+y*n+t[14],e[15]=m*r+w*o+P*n+t[15]),e}function q(e,t,a,r,o){var n=1/Math.tan(t/2),s;return e[0]=n/a,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=n,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,o!=null&&o!==1/0?(s=1/(r-o),e[10]=(o+r)*s,e[14]=2*o*r*s):(e[10]=-1,e[14]=-2*r),e}var z=q;class U{constructor(t,a,r=t.STATIC_DRAW){c(this,"gl");c(this,"buffer");if(this.gl=t,this.buffer=this.gl.createBuffer(),!this.buffer)throw new Error("Unable to create buffer.");this.bind(),this.gl.bufferData(this.gl.ARRAY_BUFFER,a,r)}bind(){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.buffer)}getBuffer(){return this.buffer}}const H=`
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
`,j=`
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
`,F=document.getElementById("oceanCanvas"),_=new W(F),i=_.getGL(),K=new L(i,i.VERTEX_SHADER,H),$=new L(i,i.FRAGMENT_SHADER,j),l=new G(i,K,$);l.use();let R=50,h=[],f=[];function M(e){h=[],f=[];for(let t=0;t<=e;t++)for(let a=0;a<=e;a++){const r=a/e,o=t/e;h.push(r*2-1,o*2-1,0),f.push(r,o)}}const X=document.getElementById("gridSizeSlider");X.addEventListener("input",e=>{R=parseInt(e.target.value,10),M(R),i.bindBuffer(i.ARRAY_BUFFER,C.getBuffer()),i.bufferData(i.ARRAY_BUFFER,new Float32Array(h),i.STATIC_DRAW),i.bindBuffer(i.ARRAY_BUFFER,I.getBuffer()),i.bufferData(i.ARRAY_BUFFER,new Float32Array(f),i.STATIC_DRAW)});M(R);const C=new U(i,new Float32Array(h)),I=new U(i,new Float32Array(f)),B=i.getAttribLocation(l.getProgram(),"aPosition"),x=i.getAttribLocation(l.getProgram(),"aUV"),k=i.getUniformLocation(l.getProgram(),"uTime"),J=i.getUniformLocation(l.getProgram(),"uModelViewMatrix"),Q=i.getUniformLocation(l.getProgram(),"uProjectionMatrix"),O=T(),S=T();z(O,Math.PI/4,F.clientWidth/F.clientHeight,.1,100);N(S,S,[0,0,-3]);i.uniformMatrix4fv(Q,!1,O);i.uniformMatrix4fv(J,!1,S);function V(e){_.resizeCanvasToDisplaySize(),i.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT),i.enableVertexAttribArray(B),i.bindBuffer(i.ARRAY_BUFFER,C.getBuffer()),i.vertexAttribPointer(B,3,i.FLOAT,!1,0,0),i.enableVertexAttribArray(x),i.bindBuffer(i.ARRAY_BUFFER,I.getBuffer()),i.vertexAttribPointer(x,3,i.FLOAT,!1,0,0),i.uniform1f(k,e*.001),i.drawArrays(i.TRIANGLE_STRIP,0,h.length/3),requestAnimationFrame(V)}V(0);
