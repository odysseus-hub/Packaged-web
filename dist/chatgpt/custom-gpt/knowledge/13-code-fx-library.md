# Signature-effects library

Tested source for `src/components/fx/` and `src/components/palette/` (scaffold.sh --fx). See vfx-recipes.md for when and how to use each.


## `assets/fx/chrome.tsx`

```tsx
"use client";

// Page chrome effects: a scroll progress rule and an "ink dot" cursor follower that labels [data-cursor] targets.
// The follower is decoration only: the native cursor stays visible, it ignores touch,
// and it doesn't render under reduced motion.
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-brand"
      style={{ scaleX }}
    />
  );
}

export function LabelCursor() {
  const reduce = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.35 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(el?.dataset.cursor ?? null);
      setEnabled(true);
    };
    const onOut = () => setEnabled(false);
    // Scrolling moves content under a still pointer: re-read what the cursor is over.
    const onScroll = () => {
      const el = document.elementFromPoint(x.get(), y.get()) as HTMLElement | null;
      setLabel(el?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onOut);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerleave", onOut);
    };
  }, [reduce, x, y]);

  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] mix-blend-multiply"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-ml-[42px] -mt-[42px] flex size-[84px] items-center justify-center rounded-full bg-brand font-mono text-[10px] uppercase tracking-[0.14em] text-white"
        // Fixed 84px dot scaled down to 14px at rest: transform only, never width/height.
        initial={{ scale: 1 / 6, opacity: 0 }}
        animate={{
          scale: label ? 1 : 1 / 6,
          opacity: enabled ? 0.9 : 0,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
      >
        <AnimatePresence>
          {label ? (
            <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
```


## `assets/fx/halftone-shader.tsx`

```tsx
"use client";

// Two-ink halftone field in a fragment shader: an accent screen and an ink screen printed over
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
uniform vec3 u_accent;
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
  float tAccent = smoothstep(0.46, 0.86, base) * 0.85;
  float tInk = smoothstep(0.56, 0.9, tone(warped * 1.6 + 3.7, t * 0.9, 9.1)) * 0.6;

  // Knock-out: like a riso printer masking ink under type, the field thins out across the
  // left/lower area where the headline sits. The cursor lens still blooms ink anywhere.
  vec2 s = px / u_res;
  float knock = smoothstep(0.3, 0.85, s.x) * 0.8 + smoothstep(0.55, 1.0, s.y) * 0.35;
  float keep = clamp(0.12 + knock, 0.0, 1.0);
  tAccent = tAccent * keep + lens * 0.7;
  tInk = tInk * keep + lens * 0.3;

  // Misregistration: the ink plate shifts with scroll velocity (and a hair at rest).
  vec2 off = vec2(1.5 + u_skew * 22.0, -1.0 - u_skew * 9.0);
  float accent = screen(px, 0.2618, tAccent, u_cell);          // 15°
  float ink = screen(px + off, 1.309, tInk, u_cell * 1.1); // 75°

  // Paper grain.
  float grain = (hash(px + fract(t) * 91.0) - 0.5) * 0.035;

  // Subtractive "multiply" printing: each ink darkens the paper.
  vec3 col = u_paper;
  col *= mix(vec3(1.0), u_accent, accent * 0.92);
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

/**
 * Full-bleed generative hero background. Put it in an absolutely positioned layer behind the
 * hero copy. Inks come from CSS tokens (--paper/--ink/--brand, falling back to
 * --background/--foreground), re-read when <html data-palette> changes.
 */
export function HalftoneShader({ className }: { className?: string }) {
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
      skew: u("u_skew"), cell: u("u_cell"), paper: u("u_paper"), accent: u("u_accent"), ink: u("u_ink"),
    };
    // Inks come from the page tokens, and are re-read whenever the palette changes.
    const applyInks = () => {
      const root = getComputedStyle(document.documentElement);
      gl.uniform3fv(U.paper, cssColor((root.getPropertyValue("--paper") || root.getPropertyValue("--background")).trim() || "white"));
      gl.uniform3fv(U.accent, cssColor(root.getPropertyValue("--brand").trim() || "magenta"));
      gl.uniform3fv(U.ink, cssColor((root.getPropertyValue("--ink") || root.getPropertyValue("--foreground")).trim() || "black"));
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
```


## `assets/fx/text.tsx`

```tsx
"use client";

import {
  motion,
  type MotionValue,
  stagger as staggerFn,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { type ElementType, type ReactNode, useEffect, useRef, useState } from "react";
import { easeOutExpo } from "@/components/motion/tokens";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Per-character reveal: each glyph rises and un-tilts from behind its own clip, staggered.
 * Words stay unbroken (no mid-word wraps). Screen readers get the plain string via aria-label.
 */
export function SplitChars({
  text,
  className,
  delay = 0,
  gap = 0.028,
  onMount = true,
  charClassName,
}: {
  text: string;
  className?: string;
  delay?: number;
  gap?: number;
  onMount?: boolean;
  charClassName?: string;
}) {
  const trigger = onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.6 } };
  return (
    <motion.span
      aria-label={text}
      className={cn("inline-block", className)}
      initial="hidden"
      {...trigger}
      variants={{ hidden: {}, show: { transition: { delayChildren: staggerFn(gap, { startDelay: delay }) } } }}
    >
      {text.split(" ").map((word, wi, words) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {[...word].map((ch, ci) => (
            <span key={ci} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
              <motion.span
                className={cn("inline-block origin-bottom-left will-change-transform", charClassName)}
                variants={{
                  hidden: { y: "105%", rotate: 12 },
                  show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: easeOutExpo } },
                }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </motion.span>
  );
}

const GLYPHS = "▚▞▖▗▘▝◆◇○●■□▲△*/\\#%&+=";

/**
 * Decode effect: glyphs churn and resolve left to right once the text scrolls into view.
 * The server renders the final string; the scramble runs only after mount (hydration-safe),
 * and never under reduced motion.
 */
export function ScrambleText({ text, className, as: Tag = "span" }: { text: string; className?: string; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = usePrefersReducedMotion();
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const total = 380 + text.length * 22;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      const solved = Math.floor(p * text.length);
      setOut(
        [...text]
          .map((c, i) => (c === " " || i < solved ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join("")
      );
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, text]);

  return (
    <Tag ref={ref} aria-label={text} className={className}>
      <span aria-hidden>{out}</span>
    </Tag>
  );
}

function Word({ children, progress, range }: { children: ReactNode; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {children}
    </motion.span>
  );
}

/** Words light up one by one as the paragraph scrolls through the viewport. */
export function ScrollWords({ text, className, accent = [] }: { text: string; className?: string; accent?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const still = useMotionValue(1);
  const progress = reduce ? still : scrollYProgress;
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <Word progress={progress} range={[i / words.length, (i + 1) / words.length]}>
            <span className={accent.includes(w.replace(/[.,]/g, "")) ? "text-brand" : undefined}>{w}</span>
          </Word>{" "}
        </span>
      ))}
    </p>
  );
}

/**
 * A misregistered (offset-printed) word: the accent plate drifts against the ink plate with the cursor,
 * on a soft spring. Static (classic 0.045em offset) under reduced motion or touch.
 */
export function OffsetWord({ children }: { children: ReactNode }) {
  const reduce = usePrefersReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 120, damping: 14, mass: 0.4 });
  const y = useSpring(my, { stiffness: 120, damping: 14, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx.set(((e.clientX / window.innerWidth) - 0.5) * 22);
      my.set(((e.clientY / window.innerHeight) - 0.5) * 14);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <span className="relative inline-block">
      <motion.span
        aria-hidden
        className="absolute inset-0 text-brand mix-blend-multiply"
        style={{ x, y, translateX: "0.045em", translateY: "0.035em" }}
      >
        {children}
      </motion.span>
      <span className="relative mix-blend-multiply">{children}</span>
    </span>
  );
}
```


## `assets/fx/tilt.tsx`

```tsx
"use client";

// 3D tilt card with a moving specular glare. The card turns toward the pointer on springs,
// its inner layers sit at different translateZ depths, and a radial highlight tracks the
// pointer. Fine pointers only; flat and static under reduced motion.
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TiltCard({ children, className, max = 14 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 220, damping: 20, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 220, damping: 20, mass: 0.5 });
  const rotateY = useTransform(sx, [0, 1], reduce ? [0, 0] : [-max, max]);
  const rotateX = useTransform(sy, [0, 1], reduce ? [0, 0] : [max, -max]);
  const gx = useTransform(sx, (v) => `${v * 100}%`);
  const gy = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgb(255 255 255 / 0.32), transparent 55%)`;
  const glareOpacity = useMotionValue(0);
  const gOp = useSpring(glareOpacity, { stiffness: 200, damping: 30 });

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
    glareOpacity.set(1);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
    glareOpacity.set(0);
  }

  return (
    <div className="[perspective:1000px]" onPointerMove={onMove} onPointerLeave={onLeave} data-cursor="Tilt">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn("relative overflow-hidden rounded-[28px]", className)}
      >
        {children}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glare, opacity: gOp }} />
      </motion.div>
    </div>
  );
}

/** A layer inside TiltCard lifted toward the viewer. */
export function Depth({ z, children, className }: { z: number; children: ReactNode; className?: string }) {
  return (
    <div className={className} style={{ transform: `translateZ(${z}px)` }}>
      {children}
    </div>
  );
}
```


## `assets/fx/variable-type.tsx`

```tsx
"use client";

// Kinetic variable type: each glyph's weight and width swell toward the pointer, on springs,
// through the font's own variable axes (here Bricolage Grotesque: wght 200–800, wdth 75–100).
// With no pointer, a slow "scanner" sweeps the line so it reads on touch screens too.
//
// Note the one rule bend: font-variation-settings changes glyph advances, i.e. layout. It's
// contained to a single line (`contain: layout paint`), never applied to body copy, and off
// under reduced motion.
import {
  animate,
  type MotionValue,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const RADIUS = 300;

function Glyph({ ch, px, py, centers, i }: { ch: string; px: MotionValue<number>; py: MotionValue<number>; centers: { current: { x: number; y: number }[] }; i: number }) {
  const t = useTransform(() => {
    const c = centers.current[i];
    if (!c) return 0;
    const d = Math.hypot(px.get() - c.x, py.get() - c.y);
    return Math.max(0, 1 - d / RADIUS);
  });
  const s = useSpring(t, { stiffness: 220, damping: 24, mass: 0.5 });
  const wght = useTransform(s, [0, 1], [320, 800]);
  const wdth = useTransform(s, [0, 1], [78, 100]);
  const settings = useMotionTemplate`"wght" ${wght}, "wdth" ${wdth}`;
  return (
    <motion.span aria-hidden className="inline-block whitespace-pre" style={{ fontVariationSettings: settings }}>
      {ch}
    </motion.span>
  );
}

export function ProximityType({ lines, className }: { lines: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const inView = useInView(ref, { amount: 0.4 });
  const [hovering, setHovering] = useState(false);
  const px = useMotionValue(-9999);
  const py = useMotionValue(-9999);
  const centers = useRef<{ x: number; y: number }[]>([]);

  // Glyph centers, relative to the block. Re-measured on resize and once fonts are ready.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      centers.current = [...el.querySelectorAll<HTMLElement>("[data-g]")].map((g) => {
        const r = g.getBoundingClientRect();
        return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
      });
    };
    measure();
    document.fonts.ready.then(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Idle scanner: a virtual pointer weaves across both lines while nobody is hovering.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce || hovering || !inView) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const c = animate(0, 1, {
      duration: 4.2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
      onUpdate: (p) => {
        px.set(-RADIUS / 3 + p * (w * 0.75 + RADIUS / 1.5));
        py.set(h * (0.25 + 0.5 * (0.5 - 0.5 * Math.cos(p * Math.PI * 3))));
      },
    });
    return () => c.stop();
  }, [reduce, hovering, inView, px, py]);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const box = e.currentTarget.getBoundingClientRect();
    px.set(e.clientX - box.left);
    py.set(e.clientY - box.top);
  }

  const label = lines.join(" ");
  let n = 0;
  return (
    <div
      ref={ref}
      aria-label={label}
      role="img"
      data-cursor="Lean"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onPointerMove={onMove}
      className={cn("touch-pan-y select-none [contain:layout_paint]", className)}
    >
      {lines.map((line, li) => (
        <div key={li} className="whitespace-nowrap">
          {[...line].map((ch) => {
            const i = n++;
            return (
              <span key={i} data-g className="inline-block">
                {reduce ? (
                  <span className="inline-block whitespace-pre" style={{ fontVariationSettings: '"wght" 700, "wdth" 92' }}>
                    {ch}
                  </span>
                ) : (
                  <Glyph ch={ch} px={px} py={py} centers={centers} i={i} />
                )}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
```


## `assets/palette/palette-switcher.tsx`

```tsx
"use client";

import { motion } from "motion/react";
import { spring } from "@/components/motion/tokens";
import { cn } from "@/lib/utils";
import { PALETTES } from "./palettes";
import { setPalette, usePalette } from "./use-palette";

/** Three overprinted ink dots. Click one to re-ink the whole page from that point. */
export function PaletteSwitcher({ className }: { className?: string }) {
  const current = usePalette();
  return (
    <div role="radiogroup" aria-label="Ink palette" className={cn("flex items-center gap-1.5 rounded-full border border-border bg-card/80 p-1", className)}>
      {PALETTES.map((p) => {
        const on = p.id === current.id;
        return (
          <button
            key={p.id}
            role="radio"
            aria-checked={on}
            aria-label={p.name}
            title={p.name}
            data-cursor="Re-ink"
            onClick={(e) => setPalette(p.id, { x: e.clientX, y: e.clientY })}
            className="relative grid size-8 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {on ? <motion.span layoutId="palette-ring" className="absolute inset-0 rounded-full border-2 border-foreground" transition={spring.layout} /> : null}
            <span className="relative block size-5">
              <span className="absolute left-0 top-0 size-3.5 rounded-full mix-blend-multiply" style={{ background: p.swatch[0] }} />
              <span className="absolute bottom-0 right-0 size-3.5 rounded-full mix-blend-multiply" style={{ background: p.swatch[1] }} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
```


## `assets/palette/palettes.ts`

```ts
// Palette sets (example values from the Motion Specimen demo: replace with your own). CSS (globals.css, [data-palette]) is the source of truth for rendering;
// this mirror exists for labels and swatches in the UI.
export type PaletteId = "tangerine" | "riso-pink" | "fern";

export const PALETTES: { id: PaletteId; name: string; paper: string; ink: string; brand: string; swatch: [string, string] }[] = [
  { id: "tangerine", name: "Tangerine × Federal Blue", paper: "oklch(0.962 0.018 78)", ink: "oklch(0.27 0.09 262)", brand: "oklch(0.64 0.2 38)", swatch: ["#eb5116", "#0c2352"] },
  { id: "riso-pink", name: "Fluoro Pink × Blue-Black", paper: "oklch(0.965 0.012 85)", ink: "oklch(0.22 0.02 265)", brand: "oklch(0.64 0.25 358)", swatch: ["#f61c8b", "#161b24"] },
  { id: "fern", name: "Riso Green × Aubergine", paper: "oklch(0.962 0.016 110)", ink: "oklch(0.26 0.09 300)", brand: "oklch(0.58 0.15 152)", swatch: ["#0a924b", "#2c1648"] },
];

export const DEFAULT_PALETTE: PaletteId = "tangerine";
export const STORAGE_KEY = "site-palette";

/** Runs before paint (inline in <head>) so a returning visitor never sees the default flash. */
export const PALETTE_BOOT = `try{var p=localStorage.getItem("${STORAGE_KEY}");if(p)document.documentElement.dataset.palette=p}catch(e){}`;
```


## `assets/palette/use-palette.ts`

```ts
"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_PALETTE, PALETTES, type PaletteId, STORAGE_KEY } from "./palettes";

// The palette lives on <html data-palette>. Reading it through useSyncExternalStore keeps
// hydration safe (the server snapshot is the default) and keeps every reader in sync.
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette"] });
  return () => mo.disconnect();
}
const read = () => (document.documentElement.dataset.palette as PaletteId | undefined) ?? DEFAULT_PALETTE;

export function usePalette() {
  const id = useSyncExternalStore(subscribe, read, () => DEFAULT_PALETTE);
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}

/**
 * Re-ink the page. With View Transitions, the new palette grows out of the click point as a
 * circle; without them (or under reduced motion) it swaps instantly.
 */
export function setPalette(id: PaletteId, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const apply = () => {
    root.dataset.palette = id;
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {}
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vt = (document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }).startViewTransition;
  if (!vt || reduce) return apply();
  const x = origin?.x ?? innerWidth / 2;
  const y = origin?.y ?? 0;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  vt.call(document, apply).ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 750, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" }
    );
  });
}
```
