import { useEffect, useRef } from "react";

/**
 * VERTEX — Reference Flow Field
 *
 * A real-time WebGL recreation of the supplied reference video:
 * dark cinematic space + broad cyan/orange flowing ribbons + luminous
 * filaments + fine drifting particles. No video or image assets required.
 */
export default function ReferenceFlowField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
      premultipliedAlpha: false,
    });

    if (!gl) return undefined;

    const vertexSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision highp float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      #define PI 3.14159265359
      #define TAU 6.28318530718

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += noise(p) * a;
          p = p * 2.02 + vec2(17.1, 9.2);
          a *= 0.5;
        }
        return v;
      }

      vec2 warp(vec2 p, float t) {
        float n1 = fbm(p * 1.35 + vec2(t * 0.025, -t * 0.018));
        float n2 = fbm(p * 1.55 + vec2(-t * 0.018, t * 0.021) + 31.7);
        return p + vec2(n1 - 0.5, n2 - 0.5) * 0.72;
      }

      // A soft ribbon made from a moving sinusoidal centerline.
      float ribbon(vec2 p, float y, float amp, float freq, float phase, float width, float speed) {
        float yy = y
          + sin(p.x * freq + phase + u_time * speed) * amp
          + sin(p.x * (freq * 0.47) - phase * 1.7 - u_time * speed * 0.63) * amp * 0.48;
        float d = abs(p.y - yy);
        return exp(-pow(d / width, 2.0));
      }

      // Long looping filament / tube. Several overlapping arcs create the
      // hand-painted, suspended-particle look from the reference.
      float loopFilament(vec2 p, vec2 center, vec2 scale, float phase, float thickness, float speed) {
        vec2 q = p - center;
        float a = atan(q.y / max(abs(q.x), 0.0001), q.x);
        float r = length(q / scale);
        float target = 1.0
          + 0.075 * sin(a * 3.0 + phase + u_time * speed)
          + 0.045 * sin(a * 7.0 - phase * 1.8 - u_time * speed * 0.7);
        return exp(-pow(abs(r - target) / thickness, 2.0));
      }

      vec3 cyanPalette(float x) {
        return vec3(0.0, 0.76, 0.86) * (0.72 + 0.38 * x);
      }

      vec3 orangePalette(float x) {
        return vec3(1.0, 0.16 + 0.16 * x, 0.025) * (0.75 + 0.42 * x);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 p = uv - 0.5;
        p.x *= aspect;

        // Gentle camera drift. Mouse only nudges the virtual camera; the
        // animation itself remains autonomous.
        vec2 mouse = (u_mouse - 0.5) * 0.08;
        p += mouse;
        p.x += sin(u_time * 0.055) * 0.025;
        p.y += cos(u_time * 0.045) * 0.018;

        vec2 wp = warp(p * 1.03, u_time);

        // Deep cinematic black/green-black field.
        float vignette = 1.0 - smoothstep(0.34, 0.86, length(p * vec2(0.92, 0.72)));
        float atmospheric = fbm(wp * 2.7 + u_time * 0.008);
        vec3 color = vec3(0.0035, 0.010, 0.009) + vec3(0.0, 0.018, 0.014) * atmospheric;

        float cyan = 0.0;
        float orange = 0.0;
        float cyanHot = 0.0;
        float orangeHot = 0.0;

        // Large ribbon masses — intentionally asymmetrical like the reference.
        cyan += ribbon(wp, -0.20, 0.20, 2.65, 0.7, 0.105, 0.33);
        cyan += ribbon(wp,  0.10, 0.15, 3.10, 3.0, 0.070, -0.28) * 0.82;
        cyan += ribbon(wp,  0.38, 0.17, 2.35, 4.5, 0.085, 0.22) * 0.72;

        orange += ribbon(wp,  0.00, 0.22, 2.25, 1.8, 0.125, 0.31);
        orange += ribbon(wp, -0.32, 0.13, 3.65, 5.0, 0.072, -0.24) * 0.9;
        orange += ribbon(wp,  0.28, 0.11, 4.10, 2.2, 0.055, 0.27) * 0.66;

        // Broad curved loops give the field its suspended 3D-object feeling.
        float cLoop = loopFilament(wp, vec2(-0.46, 0.02), vec2(0.48, 0.28), 1.0, 0.055, 0.35);
        cLoop += loopFilament(wp, vec2(0.38, 0.05), vec2(0.36, 0.31), 4.1, 0.060, -0.27) * 0.92;
        float oLoop = loopFilament(wp, vec2(0.05, -0.02), vec2(0.62, 0.34), 2.3, 0.045, 0.31);
        oLoop += loopFilament(wp, vec2(0.55, -0.08), vec2(0.32, 0.26), 5.0, 0.045, 0.29) * 0.95;

        cyan += cLoop * 1.35;
        orange += oLoop * 1.25;

        // Fine bright cores riding inside the broad ribbons.
        cyanHot += ribbon(wp * 1.02, -0.19, 0.19, 2.67, 0.72, 0.016, 0.33);
        cyanHot += ribbon(wp * 1.01, 0.12, 0.14, 3.12, 3.02, 0.013, -0.28) * 0.72;
        orangeHot += ribbon(wp, 0.01, 0.22, 2.26, 1.82, 0.018, 0.31);
        orangeHot += ribbon(wp, -0.31, 0.13, 3.67, 5.02, 0.014, -0.24) * 0.85;

        // Grain/noise makes the ribbons feel particulate rather than vector-flat.
        float grain = noise(wp * 32.0 + u_time * 0.16);
        float micro = smoothstep(0.54, 0.92, grain);
        cyan *= 0.72 + micro * 0.42;
        orange *= 0.72 + micro * 0.48;

        color += cyanPalette(clamp(cyan, 0.0, 1.7)) * cyan * 0.92;
        color += orangePalette(clamp(orange, 0.0, 1.7)) * orange * 0.98;
        color += vec3(0.0, 0.95, 1.0) * cyanHot * 2.4;
        color += vec3(1.0, 0.27, 0.035) * orangeHot * 2.55;

        // Floating particles concentrated around the active flow.
        vec2 gp = wp * 10.0;
        vec2 cell = floor(gp);
        vec2 local = fract(gp) - 0.5;
        float h = hash21(cell);
        float drift = sin(u_time * (0.4 + h) + h * 30.0);
        local.y += drift * 0.11;
        float particle = smoothstep(0.055, 0.0, length(local));
        float bandMask = clamp((cyan + orange) * 1.2, 0.0, 1.0);
        particle *= bandMask * smoothstep(0.24, 0.85, h);
        vec3 particleColor = mix(vec3(0.0, 0.82, 0.92), vec3(1.0, 0.24, 0.03), hash21(cell + 8.3));
        color += particleColor * particle * 0.75;

        // Small bloom pass approximation.
        float glow = smoothstep(0.02, 0.55, cyan + orange);
        color += vec3(0.0, 0.07, 0.065) * glow * vignette;

        color *= 0.64 + vignette * 0.62;
        color = 1.0 - exp(-color * 1.35);
        color = pow(color, vec3(0.92));

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return undefined;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return undefined;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const position = gl.getAttribLocation(program, "a_position");
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const mouse = gl.getUniformLocation(program, "u_mouse");

    let raf = 0;
    let start = performance.now();
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;

    const onPointerMove = (event) => {
      targetX = event.clientX / Math.max(window.innerWidth, 1);
      targetY = 1.0 - event.clientY / Math.max(window.innerHeight, 1);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const width = Math.max(1, Math.floor(window.innerWidth * dpr));
      const height = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        gl.viewport(0, 0, width, height);
      }
    };

    const render = (now) => {
      resize();
      mouseX += (targetX - mouseX) * 0.035;
      mouseY += (targetY - mouseY) * 0.035;

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, (now - start) * 0.001);
      gl.uniform2f(mouse, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      raf = requestAnimationFrame(render);
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      // Still render a static frame so the site retains the visual identity.
      resize();
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, 0.0);
      gl.uniform2f(mouse, 0.5, 0.5);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else {
      raf = requestAnimationFrame(render);
    }

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas ref={canvasRef} className="reference-flow-field" aria-hidden="true" />;
}
