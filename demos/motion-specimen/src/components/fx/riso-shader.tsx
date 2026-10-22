"use client";

// Riso halftone field in a fragment shader: two ink screens (pink, blue-black) printed over
// flowing noise. The cursor blooms ink and pulls a lens through the field; scroll velocity
// knocks the two plates off-register. Driven by Motion's frame loop (one clock for the page),
// paused offscreen, and frozen to a single printed frame under reduced motion.
import { cancelFrame, frame } from "motion/react";
import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;      // px, y up
uniform float u_bloom;     // 0..1 pointer presence
uniform float u_skew;      // scroll velocity, smoothed
uniform float u_cell;      // halftone cell, px
uniform vec3 u_paper;
uniform vec3 u_pink;
uniform vec3 u_ink;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = r * p * 2.03; a *= 0.5; }
  return v;
}
// Tone field: domain-warped fbm drifting over time.
float tone(vec2 uv, float t, float seed) {
  vec2 q = vec2(fbm(uv + vec2(0.0, t * 0.05) + seed), fbm(uv + vec2(5.2, 1.3) - t * 0.04));
  return fbm(uv + 1.6 * q + t * 0.02);
}
// One halftone screen at angle a: coverage of the dot under this pixel (antialiased).
float screen(vec2 px, float a, float t, float cell) {
  mat2 r = mat2(cos(a), -sin(a), sin(a), cos(a));
  vec2 g = r * px / cell;
  vec2 c = fract(g) - 0.5;
  float rad = sqrt(clamp(t, 0.0, 1.0)) * 0.62;
  float d = length(c);
  float aa = 1.2 / cell;
  return 1.0 - smoothstep(rad - aa, rad + aa, d);
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 uv = px / u_res.y;
  float t = u_time;

  // Cursor lens: pull the field toward the pointer, and bloom ink around it.
  vec2 m = u_mouse;
  vec2 dm = px - m;
  float md = length(dm) / u_res.y;
  float lens = exp(-md * md * 18.0) * u_bloom;
  vec2 warped = uv - normalize(dm + 1e-4) * lens * 0.06;

  float base = tone(warped * 1.6, t, 0.0);
  float tPink = smoothstep(0.46, 0.86, base) * 0.85;
  float tInk = smoothstep(0.56, 0.9, tone(warped * 1.6 + 3.7, t * 0.9, 9.1)) * 0.6;

  // Knock-out: like a riso printer masking ink under type, the field thins out across the
  // left/lower area where the headline sits. The cursor lens still blooms ink anywhere.
  vec2 s = px / u_res;
  float knock = smoothstep(0.3, 0.85, s.x) * 0.8 + smoothstep(0.55, 1.0, s.y) * 0.35;
  float keep = clamp(0.12 + knock, 0.0, 1.0);
  tPink = tPink * keep + lens * 0.7;
  tInk = tInk * keep + lens * 0.3;

  // Misregistration: the ink plate shifts with scroll velocity (and a hair at rest).
  vec2 off = vec2(1.5 + u_skew * 22.0, -1.0 - u_skew * 9.0);
  float pink = screen(px, 0.2618, tPink, u_cell);          // 15°
  float ink = screen(px + off, 1.309, tInk, u_cell * 1.1); // 75°

  // Paper grain.
  float grain = (hash(px + fract(t) * 91.0) - 0.5) * 0.035;

  // Subtractive "multiply" printing: each ink darkens the paper.
  vec3 col = u_paper;
  col *= mix(vec3(1.0), u_pink, pink * 0.92);
  col *= mix(vec3(1.0), u_ink, ink * 0.78);
  gl_FragColor = vec4(col + grain, 1.0);
}
`;

/** Resolve any CSS color (oklch included) to linear-ish 0..1 RGB via a 1px 2D canvas. */
function cssColor(value: string): [number, number, number] {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d");
  if (!ctx) return [1, 1, 1];
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

export function RisoShader({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    if (!gl) return; // CSS paper background shows through: still a finished page.
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const U = {
      res: u("u_res"), time: u("u_time"), mouse: u("u_mouse"), bloom: u("u_bloom"),
      skew: u("u_skew"), cell: u("u_cell"), paper: u("u_paper"), pink: u("u_pink"), ink: u("u_ink"),
    };
    // Inks come from the page tokens, and are re-read whenever the palette changes.
    const applyInks = () => {
      const root = getComputedStyle(document.documentElement);
      gl.uniform3fv(U.paper, cssColor(root.getPropertyValue("--paper").trim() || "white"));
      gl.uniform3fv(U.pink, cssColor(root.getPropertyValue("--brand").trim() || "magenta"));
      gl.uniform3fv(U.ink, cssColor(root.getPropertyValue("--ink").trim() || "black"));
    };
    applyInks();
    const paletteWatch = new MutationObserver(() => {
      applyInks();
      if (reduceNow()) draw(12.0); // no loop running: repaint the still frame
    });
    paletteWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette"] });

    const reduceNow = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reduce = reduceNow();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0;
    const resize = () => {
      w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(U.res, w, h);
      gl.uniform1f(U.cell, Math.max(7, Math.round(Math.min(w, h) / 70)));
    };
    resize();

    // Pointer & scroll state, eased inside the loop.
    const target = { x: w * 0.72, y: h * 0.55, on: 0 };
    const cur = { x: target.x, y: target.y, bloom: 0, skew: 0 };
    let lastScroll = window.scrollY;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      target.x = (e.clientX - r.left) * dpr;
      target.y = (r.bottom - e.clientY) * dpr;
      target.on = e.clientY < r.bottom && e.clientY > r.top ? 1 : 0;
    };
    const onLeave = () => (target.on = 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const t0 = performance.now();
    const draw = (time: number) => {
      gl.uniform1f(U.time, time);
      gl.uniform2f(U.mouse, cur.x, cur.y);
      gl.uniform1f(U.bloom, cur.bloom);
      gl.uniform1f(U.skew, cur.skew);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (reduce) {
      // One printed frame. No loop, no pointer response.
      draw(12.0);
      canvas.style.opacity = "1";
      return () => {
        paletteWatch.disconnect();
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
      };
    }

    const loop = ({ timestamp }: { timestamp: number }) => {
      if (!visible || document.hidden) return;
      cur.x += (target.x - cur.x) * 0.08;
      cur.y += (target.y - cur.y) * 0.08;
      cur.bloom += (target.on - cur.bloom) * 0.05;
      const sy = window.scrollY;
      const v = Math.max(-1, Math.min(1, (sy - lastScroll) / 60));
      lastScroll = sy;
      cur.skew += (v - cur.skew) * 0.12;
      draw((timestamp - t0) / 1000 + 12.0);
    };
    frame.render(loop, true);
    requestAnimationFrame(() => (canvas.style.opacity = "1"));

    return () => {
      paletteWatch.disconnect();
      cancelFrame(loop);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={className}
      style={{ opacity: 0, transition: "opacity 900ms cubic-bezier(0.16,1,0.3,1)" }}
    />
  );
}
