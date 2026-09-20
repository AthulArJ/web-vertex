import { useEffect, useRef } from "react";

export default function DeepLavaField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });

    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;

      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;

      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2 u_resolution;

      float hash(vec2 p) {
        p = fract(p * vec2(127.1, 311.7));
        p += dot(p, p + 34.5);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);

        f = f * f * (3.0 - 2.0 * f);

        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;

        for (int i = 0; i < 6; i++) {
          value += noise(p) * amplitude;
          p = p * 2.02 + vec2(17.7, 9.1);
          amplitude *= 0.5;
        }

        return value;
      }

      float ridged(vec2 p) {
        float n = fbm(p);
        return 1.0 - abs(n * 2.0 - 1.0);
      }

      void main() {
        vec2 uv = v_uv;

        float aspect = u_resolution.x / max(u_resolution.y, 1.0);
        vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

        float t = u_time * 0.075;

        // Slow, viscous horizontal flow.
        vec2 flow = p;
        flow.x += t * 0.42;
        flow.y += sin(flow.x * 2.2 + t * 1.1) * 0.08;

        // Domain warping creates irregular liquid movement.
        vec2 warp = vec2(
          fbm(flow * 2.4 + vec2(t * 0.35, -t * 0.16)),
          fbm(flow * 2.4 + vec2(-t * 0.22, t * 0.28))
        );

        vec2 liquid = flow + (warp - 0.5) * 0.62;

        float broad = fbm(liquid * 2.35);
        float medium = fbm(liquid * 5.2 + vec2(t * 0.38, -t * 0.24));
        float fine = ridged(liquid * 11.0 - vec2(t * 0.75, t * 0.32));

        // Hot channels are narrow and irregular.
        float channels = smoothstep(
          0.58,
          0.76,
          broad * 0.56 + medium * 0.34 + fine * 0.10
        );

        float veins = 1.0 - smoothstep(
          0.035,
          0.105,
          abs(medium - 0.49)
        );

        float hotCore = smoothstep(
          0.64,
          0.88,
          fine * 0.58 + medium * 0.42
        );

        // Dark crust texture.
        float crustTexture = fbm(liquid * 13.0 + vec2(-t * 0.42, t * 0.18));
        float crust = smoothstep(0.28, 0.66, crustTexture);

        float heat = clamp(
          channels * 0.58 +
          veins * 0.34 +
          hotCore * 0.32,
          0.0,
          1.0
        );

        // Concentrate the lava visually so the underlying photo still exists.
        float edgeFade =
          smoothstep(0.02, 0.18, uv.x) *
          smoothstep(0.02, 0.18, 1.0 - uv.x) *
          smoothstep(0.02, 0.16, uv.y) *
          smoothstep(0.02, 0.16, 1.0 - uv.y);

        // Deep fiery palette.
        vec3 blackCrust = vec3(0.004, 0.001, 0.0005);
        vec3 deepCrust = vec3(0.035, 0.004, 0.001);
        vec3 deepRed = vec3(0.22, 0.008, 0.001);
        vec3 moltenRed = vec3(0.72, 0.035, 0.003);
        vec3 orange = vec3(1.0, 0.23, 0.008);
        vec3 yellow = vec3(1.0, 0.76, 0.16);

        vec3 color = mix(blackCrust, deepCrust, crust * 0.7);
        color = mix(color, deepRed, smoothstep(0.22, 0.48, heat));
        color = mix(color, moltenRed, smoothstep(0.42, 0.68, heat));
        color = mix(color, orange, smoothstep(0.60, 0.86, heat));
        color = mix(color, yellow, hotCore * 0.70);

        // Internal glow follows the hot channels.
        float glow = smoothstep(0.35, 0.85, heat);
        color += vec3(1.0, 0.055, 0.002) * glow * 0.18;

        // Darken parts of the crust so it feels like solidified material.
        color *= 0.60 + crust * 0.40;

        float alpha = clamp(
          heat * 0.92 +
          veins * 0.10,
          0.0,
          0.96
        ) * edgeFade;

        // Keep the coolest crust almost transparent.
        alpha *= 0.34 + heat * 0.66;

        gl_FragColor = vec4(color, alpha);
      }
    `;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("DeepLavaField shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vertexShader = compile(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("DeepLavaField program error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    let animationFrame = 0;
    let resizeObserver = null;
    let stopped = false;
    const start = performance.now();

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.35);

      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));

      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (now) => {
      if (stopped) return;

      const seconds = (now - start) / 1000;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );

      gl.uniform1f(timeLocation, seconds);
      gl.uniform2f(
        resolutionLocation,
        canvas.width,
        canvas.height
      );

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrame = requestAnimationFrame(render);
    };

    resize();

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
    } else {
      window.addEventListener("resize", resize);
    }

    animationFrame = requestAnimationFrame(render);

    return () => {
      stopped = true;
      cancelAnimationFrame(animationFrame);

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", resize);
      }

      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="deep-lava-field"
      aria-hidden="true"
    />
  );
}
